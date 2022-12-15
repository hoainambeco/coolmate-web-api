import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { MongoRepository, Repository } from "typeorm";
import { Carts, ItemCarts } from "./entities/cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CartDto } from "./dto/cart-dto";
import { User } from "../users/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { ErrorException } from "../exceptions/error.exception";
import { Product } from "../product/entities/product.entity";
import { ObjectId } from "mongodb";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ItemCarts)
    private readonly itemCartsRepository: Repository<ItemCarts>,
    @InjectRepository(Carts)
    private readonly cartsRepository: Repository<Carts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {
  }

  async create(createCartDto: CreateCartDto) {
    let user = AuthService.getAuthUser();
    let cart = await this.cartsRepository.findOne({ where: { userId: user.id, status: "active" } });
    const listProducts = await this.productRepository.findOneBy(ObjectId(createCartDto.products[0].productId));
    // console.log(listProducts);
    if (!listProducts) {
      throw new ErrorException(404, "Product not found");
    }
    if (listProducts.color.find(color => color.name === createCartDto.products[0].colorName) === undefined) {
      throw new ErrorException(404, "Color not found");
    }
    if (listProducts.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName) === undefined) {
      throw new ErrorException(404, "Size not found");
    }
    const productCount = listProducts.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName).productCount;
    if (productCount < createCartDto.products[0].quantity || !productCount) {
      throw new ErrorException(404, "Product count is not enough");
    }
    const products = {
      productId: createCartDto.products[0].productId,
      colorName: createCartDto.products[0].colorName,
      sizeName: createCartDto.products[0].sizeName,
      quantity: createCartDto.products[0].quantity,
      product: listProducts
    };
    let find = false;
    // cart.carts.map(async item => {
    //   // @ts-ignore
    //   if (item.products.productId === products.productId && item.colorName === products.colorName && item.sizeName === products.sizeName) {
    //     // @ts-ignore
    //     item.quantity += products.quantity;
    //     await this.itemCartsRepository.save(item);
    //     find= true;
    //   }
    // });
    if(!find){
      // @ts-ignore
      await this.itemCartsRepository.save({ ...createCartDto, userId: user.id, cartId: "null", products: products });
    }
    // @ts-ignore
    const listItemCarts = await this.itemCartsRepository.find({ where: { userId: user.id, cartId: "null" } });
    if (cart) {
      await this.cartsRepository.update({ userId: user.id }, { userId: user.id, carts: listItemCarts });
    } else {
      cart = await this.cartsRepository.save({ userId: user.id, carts: listItemCarts, status: "active" });
    }
    for (const item of listItemCarts) {
      // @ts-ignore
      await this.itemCartsRepository.update({ id: item.id }, { cartId: cart.id.toString() });
    }

    return await JSON.parse(JSON.stringify(createCartDto));
  }

  async findAll(): Promise<CartDto[]> {
    const user = AuthService.getAuthUser();
    const carts = await this.cartsRepository.findBy({ userId: user.id });
    // const listProducts = [];
    console.log(carts);
    // for (const cart of carts) {
    //   // @ts-ignore
    //   for (const product of cart.carts) {
    //     listProducts.push({
    //       ...product,
    //       // @ts-ignore
    //       product: await this.productRepository.findOneBy(ObjectId(product.productId))
    //     });
    //   }
    //
    //   // cart.products = listProducts;
    // }

    return JSON.parse(JSON.stringify(carts));
  }

  async findOne(id: string) {
    // @ts-ignore
    const cart = await this.cartsRepository.findOneBy(id);
    if (!cart) {
      throw new ErrorException(404, "Cart not found");
    }
    const listProducts = [];
    for (const product of cart.carts) {
      listProducts.push({
        ...product,
        //@ts-ignore
        product: await this.productRepository.findOneBy(ObjectId(product.productId))
      });
    }
    // @ts-ignore
    cart.products = listProducts;
    return await JSON.parse(JSON.stringify(cart));
  }

  async findByUserId() {
    let user = AuthService.getAuthUser();
    const carts = await this.cartsRepository.find({ where: { userId: user.id } });
    if (carts.length <= 0) {
      throw new ErrorException(404, "Cart not found");
    }
    const listProducts = [];
    for (const cart of carts) {
      for (const product of cart.carts) {
        listProducts.push({
          ...product,
          // @ts-ignore
          product: await this.productRepository.findOneBy(ObjectId(product.productId))
        });
      }
      // @ts-ignore
      cart.products = listProducts;
    }
    return JSON.parse(JSON.stringify(carts));
  }

  async update(id: string, updateCartDto: UpdateCartDto) {

    const cart = this.findByUserId();
    return await this.itemCartsRepository.update(id, updateCartDto);
  }

  async remove(id: string) {
    let user = AuthService.getAuthUser();
    const cart = await this.cartsRepository.findOneBy({ userId: user.id });
    if (!cart) {
      throw new ErrorException(404, "Cart not found");
    }
    const listItemCarts = [];
    cart.carts.map(itemCart => {
      const item = JSON.parse(JSON.stringify(itemCart));
      if (item.id !== id)
        listItemCarts.push(item);
    });
    // @ts-ignore
    cart.carts = listItemCarts;
    await this.cartsRepository.update({ userId: user.id }, cart);
    return await this.itemCartsRepository.delete(id);
  }
}
