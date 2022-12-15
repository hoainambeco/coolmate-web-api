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
  brand: string;

  @ApiProperty()
  image: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  cmtCount: number;

  @ApiProperty()
  productCount: number;

  @ApiProperty()
  quantitySold: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  specialSale: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  sellingPrice: number;

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
  sellCount: number;

  @ApiProperty()
  style: string;

  @ApiProperty()
  catalog: string;

  @ApiProperty()
  material : string;

  @ApiProperty()
  purpose : string[];

  @ApiProperty()
  feature : string[];

  @ApiProperty()
  color: [{
    name: string;
    colorCode: string;
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
    this.type = entity.type;
    this.productName = entity.productName;
    this.brand = entity.brand;
    this.image = entity.image;
    this.status = entity.status;
    this.cmtCount = entity.cmtCount;
    this.productCount = entity.productCount;
    this.quantitySold = entity.quantitySold;
    this.specialSale = entity.specialSale;
    this.rebate = entity.rebate;
    this.likeCount = entity.likeCount;
    this.sellCount = entity.sellCount;
    this.price = entity.price;
    this.sellingPrice = entity.sellingPrice;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
    this.isDeleted = entity.isDeleted;
    this.promotionalPrice = entity.promotionalPrice;
    this.color = entity.color;
    this.rating = entity.rating;
    this.style = entity.style;
    this.catalog = entity.catalog;
    this.material = entity.material;
    this.purpose = entity.purpose;
    this.feature = entity.feature;
  }
}