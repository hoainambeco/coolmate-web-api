import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { MongoRepository, Repository } from "typeorm";
import { Cart } from "./entities/cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CartDto } from "./dto/cart-dto";
import { User } from "../users/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { ErrorException } from "../exceptions/error.exception";
import { Product } from "../product/entities/product.entity";
import {ObjectId} from 'mongodb';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  @InjectRepository(Product)
  private productRepository: Repository<Product>,
  ) {}
  async create(createCartDto: CreateCartDto) {
    let user = AuthService.getAuthUser();
    const products = await this.productRepository.findOneBy(ObjectId(createCartDto.products[0].productId));
    console.log(products);
    if(!products){
      throw new ErrorException(404, 'Product not found');
    }
    if(products.color.find(color => color.name === createCartDto.products[0].colorName) === undefined){
      throw new ErrorException(404, 'Color not found');
    }
    if(products.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName) === undefined){
      throw new ErrorException(404, 'Size not found');
    }
    const productCount = products.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName).productCount;
    if(productCount < createCartDto.products[0].quantity || !productCount){
      throw new ErrorException(404, 'Product count is not enough');
    }
    return await this.cartRepository.save({...createCartDto, userId: user.id})
  }

  async findAll():Promise<CartDto[]>{
    const carts = await this.cartRepository.find();
    console.log(carts);
    // @ts-ignore
    return carts.map(cart => {
      return {
        ...cart,
        id: cart.id.toString()
      }
    })
  }

  async findOne(id: string) {
    console.log(id);
    // @ts-ignore
    const cart = await this.cartRepository.findOneBy(id);
    if(!cart){
      throw new ErrorException(404, 'Cart not found');
    }
    cart.id = cart.id.toString();
    return cart;
  }

  async findByUserId(id: string) {
    const carts = await this.cartRepository.find({where:{userId: id}})
    if ( carts.length <= 0) {
      throw new ErrorException( 404,'Cart not found');
    }
    return carts.map(cart => {
      return {
        ...cart,
        id: cart.id.toString(),
      }
    });
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = this.findByUserId(id);
    return await this.cartRepository.update(id, updateCartDto);
  }

  async remove(id: string) {
    return await this.cartRepository.delete(id);
  }
}
