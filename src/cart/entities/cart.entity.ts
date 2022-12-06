import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn
} from "typeorm";
import { ProductDto } from "../../product/dto/product.dto";
import { User } from "../../users/entities/user.entity";
import { UserDto } from "../../users/dto/user.dto";
import { CartDto } from "../dto/cart-dto";

@Entity("itemCarts")
export class ItemCarts {
  @ObjectIdColumn() id: string;
  @Column() name: string;
  @Column() quantity: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;
  @Column() products: [{
      productId: string,
      quantity: number,
      colorName: string,
      sizeName: string,
  }];
  @Column()
  userId: string;
}

@Entity("carts")
export class Carts {
  @ObjectIdColumn() id: string;
  @Column() userId: string;
  @Column() cartId: [string];
  @Column() carts: [object];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;
}