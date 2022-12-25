import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateCartDto, UpdateItemCartsDto } from "./dto/create-cart.dto";
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
import mongoose from "mongoose";

export const itemCartSchema = mongoose.model("itemcarts", new mongoose.Schema(ItemCarts));
export const cartSchema = mongoose.model("carts", new mongoose.Schema(Carts));

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

  // async create(createCartDto: CreateCartDto) {
  //   let user = AuthService.getAuthUser();
  //   let cart = await this.cartsRepository.findOne({ where: { userId: user.id, status: "active" } });
  //   let error='';
  //   const listProducts = await this.productRepository.findOneBy(ObjectId(createCartDto.products[0].productId));
  //   if (!listProducts) {
  //     throw new ErrorException(404, "Product not found");
  //   }
  //   if(listProducts.status !== StatusProductEnum.CON_HANG ){
  //     throw new ErrorException(404, "Product not available");
  //   }
  //   if (listProducts.color.find(color => color.name === createCartDto.products[0].colorName) === undefined) {
  //     throw new ErrorException(404, "Color not found");
  //   }
  //   if (listProducts.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName) === undefined) {
  //     throw new ErrorException(404, "Size not found");
  //   }
  //   const productCount = listProducts.color.find(color => color.name === createCartDto.products[0].colorName).size.find(size => size.name === createCartDto.products[0].sizeName).productCount;
  //   if (productCount < createCartDto.products[0].quantity || !productCount) {
  //     throw new ErrorException(404, "Product count is not enough");
  //   }
  //   const products = {
  //     productId: createCartDto.products[0].productId,
  //     colorName: createCartDto.products[0].colorName,
  //     sizeName: createCartDto.products[0].sizeName,
  //     quantity: createCartDto.products[0].quantity,
  //     product: listProducts
  //   };
  //   const itemCarts = await itemCartSchema.find({userId:user.id.toString()}).exec();
  //   // const itemCart = await itemCartSchema.findOne({productId: products.productId, colorName: products.colorName, sizeName: products.sizeName});
  //   if (itemCarts.length > 0) {
  //     itemCarts.map(async item => {
  //       const itemCart = JSON.parse(JSON.stringify(item));
  //       // @ts-ignore
  //       if (itemCart.products.productId === products.productId && itemCart.products.colorName === products.colorName && itemCart.products.sizeName === products.sizeName) {
  //         console.log(JSON.parse(JSON.stringify(itemCart)).products.quantity + createCartDto.products[0].quantity);
  //         products.quantity = parseInt((JSON.parse(JSON.stringify(itemCart)).products.quantity + createCartDto.products[0].quantity).toString());
  //         if (products.quantity > productCount) {
  //           error = "Product count is not enough";
  //         }
  //         const update = {products: products}
  //         // @ts-ignore
  //         await this.itemCartsRepository.update(ObjectId(itemCart._id), update);
  //       }
  //       else {
  //         // @ts-ignore
  //         await this.itemCartsRepository.save({ ...createCartDto, userId: user.id, cartId: "null", products: products });
  //       }
  //     })
  //     if(error){
  //       throw new ErrorException(404, error);
  //     }
  //   }
  //   else {
  //     // @ts-ignore
  //     await this.itemCartsRepository.save({ ...createCartDto, userId: user.id, cartId: "null", products: products });
  //   }
  //   //@ts-ignore
  //   const listItemCarts = await this.itemCartsRepository.find({ where: { userId: user.id, cartId: "null" } });
  //   if (cart) {
  //     // @ts-ignore
  //     const id = cart.carts.map(cart => cart.id);
  //     id.push(...listItemCarts.map(item => item.id));
  //     const list = await itemCartSchema.find({ where: { id: {$in: id} } });
  //     // itemCarts.push(...listItemCarts);
  //     await this.cartsRepository.update({ userId: user.id }, { userId: user.id, carts: list });
  //   } else {
  //     cart = await this.cartsRepository.save({ userId: user.id, carts: listItemCarts, status: "active" });
  //   }
  //   for (const item of listItemCarts) {
  //     // @ts-ignore
  //     await this.itemCartsRepository.update({ id: item.id }, { cartId: cart.id.toString() });
  //   }
  //
  //   return await JSON.parse(JSON.stringify(createCartDto));
  // }
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
    if (!find) {
      // @ts-ignore
      await this.itemCartsRepository.save({ ...createCartDto, userId: user.id, cartId: "null", products: products });
    }
    // @ts-ignore
    const listItemCarts = await this.itemCartsRepository.findBy({ userId: user.id, cartId: "null" });
    if (cart) {
      // @ts-ignore
      const id = cart.carts.map(cart => cart.id);
      id.push(...listItemCarts.map(item => item.id));
      const list = await itemCartSchema.find({ where: { id: { $in: id } } });
      // itemCarts.push(...listItemCarts);
      await this.cartsRepository.update({ userId: user.id }, { userId: user.id, carts: list });
      // await this.cartsRepository.update({ userId: user.id }, { userId: user.id, carts: listItemCarts });
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
    const carts = await this.cartsRepository.findBy({ userId: user.id, status: "active" });
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
    const carts = await this.cartsRepository.find({ where: { userId: user.id, status: "active" } });
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
      if (item._id !== id)
        listItemCarts.push(item);
    });
    // @ts-ignore
    cart.carts = listItemCarts;
    await this.cartsRepository.update({ userId: user.id, status:'active' }, cart);
    return await this.itemCartsRepository.delete(id);
  }

  async portRemove(id: [string]) {
    console.log(id);
    let user = AuthService.getAuthUser();
    const cart = await this.cartsRepository.findOneBy({ userId: user.id });
    if (!cart) {
      throw new ErrorException(404, "Cart not found");
    }
    id.map((id) => {    cartSchema.findOne({ where: { userId: user.id , status:"active" } }).then(data => console.log(JSON.parse(JSON.stringify(data))));
      // @ts-ignore
      cartSchema.findOneAndUpdate({ where: { userId: user.id , status:"active" } }, cart.carts.splice(cart.carts.findIndex(item => item.id == id), 1), function(err, res) {
        if (err) throw err;
        // console.log(res);
        // console.log("1 document updated");

      });
    });

    return cart;
  }

  async findAllItemCarts() {
    const user = AuthService.getAuthUser();
    // console.log(user);
    // @ts-ignore
    const carts = await this.itemCartsRepository.findBy({userId: user.id});
    if (!carts) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "Cart not found");
    }
    return JSON.parse(JSON.stringify(carts));
  }

  async updateItemCarts(updateItemCartsDto: UpdateItemCartsDto, idItemCart: string) {
    // @ts-ignore
    const itemCart = await this.itemCartsRepository.findOneBy(idItemCart );
    if (!itemCart) {
      throw new ErrorException(HttpStatus.NOT_FOUND, "ItemCart not found");
    }
    // @ts-ignore
    const listProducts = await this.productRepository.findOneBy(ObjectId(itemCart.products.productId));
    // console.log(listProducts);
    if (!listProducts) {
      throw new ErrorException(404, "Product not found");
    }
    if (listProducts.color.find(color => color.name === updateItemCartsDto.colorName) === undefined) {
      throw new ErrorException(404, "Color not found");
    }
    if (listProducts.color.find(color => color.name === updateItemCartsDto.colorName).size.find(size => size.name === updateItemCartsDto.sizeName) === undefined) {
      throw new ErrorException(404, "Size not found");
    }
    const productCount = listProducts.color.find(color => color.name === updateItemCartsDto.colorName).size.find(size => size.name === updateItemCartsDto.sizeName).productCount;
    if (productCount < updateItemCartsDto.quantity || !productCount) {
      throw new ErrorException(404, "Product count is not enough");
    }
    const products = {
      // @ts-ignore
      productId: itemCart.products.productId,
      colorName: updateItemCartsDto.colorName,
      sizeName: updateItemCartsDto.sizeName,
      quantity: updateItemCartsDto.quantity,
      product: listProducts
    };
    // @ts-ignore
    itemCart.products= products;
    await this.itemCartsRepository.save(itemCart);
    return JSON.parse(JSON.stringify(itemCart));
  }
}
