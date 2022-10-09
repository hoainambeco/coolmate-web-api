import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class ProductDto{
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  image: string[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  PromotionalPrice: number;

  @ApiProperty()
  size: [{
    name: string;
    color: [{
      name: string;
      colorCode: string
    }];
    quantity: number;
  }];

  @ApiProperty()
  rating: [{
    userId: string;
    rating: number;
    comment: string;
    image: string[];
    date: Date;
  }];

  constructor(entity : Product) {
    this.id = entity.id.toString();
    this.type = entity.type;
    this.productName = entity.productName;
    this.image = entity.image;
    this.price = entity.price;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
    this.isDeleted = entity.isDeleted;
    this.status = entity.status;
    this.PromotionalPrice = entity.PromotionalPrice;
    this.size = entity.size;
    this.rating = entity.rating;
  }
}