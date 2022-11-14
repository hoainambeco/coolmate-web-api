import { ApiProperty } from "@nestjs/swagger";
import { ProductDto } from "../../product/dto/product.dto";
import { Cart } from "../entities/cart.entity";
import { type } from "os";
import { UserDto } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";

export  class CartDto{
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  products: [{
      productId: string,
      quantity: number,
      colorName: string,
      sizeName: string,
  }];

  @ApiProperty()
  userId: string;


constructor(entity : Cart) {
    this.id = entity.id.toString();
    this.name = entity.name;
    this.quantity = entity.quantity;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
    this.products = entity.products;
    this.userId = entity.userId;
  }
}