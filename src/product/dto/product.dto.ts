import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class ProductDto{
  @ApiProperty()
  id: string;

  @ApiProperty()
  modelID: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  image: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  cmtCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  specialSale: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  rebate: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  promotionalPrice: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  color: [{
    name: string;
    image : string[];
    size: [{
      name: string;
      productCount: number
    }];
  }];

  @ApiProperty()
  rating: [{
    userId: string;
    modelID: string;
    score: number;
    comment: string;
    image: string[];
    date: Date;
  }];

  constructor(entity : Product) {
    this.id = entity.id.toString();
    this.modelID = entity.modelID;
    this.cmtCount = entity.cmtCount;
    this.specialSale = entity.specialSale;
    this.rebate = entity.rebate;
    this.likeCount = entity.likeCount;
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
    this.promotionalPrice = entity.promotionalPrice;
    this.color = entity.color;
    this.rating = entity.rating;
  }
}