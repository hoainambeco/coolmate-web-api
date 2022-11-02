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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(createCartDto: CreateCartDto) {
    console.log(createCartDto);
    let user = AuthService.getAuthUser();
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
