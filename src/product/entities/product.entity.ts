import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity("product")
export class Product {
  @ObjectIdColumn() id: ObjectID;
  @Column() modelID: string;
  @Column() type: string;
  @Column() productName: string;
  @Column() image: string[];
  @Column() status: string;
  @Column() cmtCount: number;
  @Column() createdAt: Date;
  @Column() specialSale: number;
  @Column() promotionalPrice: number;
  @Column() rebate: number;
  @Column() price: number;
  @Column() description: string;
  @Column() updatedAt: Date;
  @Column() deletedAt: Date;
  @Column() isDeleted: boolean;
  @Column() likeCount: number;
  @Column() color: [{
    name: string;
    image: string[];
    size: [{
      name: string;
      productCount: number
    }];
  }];
  @Column() rating: [{
    userId: string;
    modelID: string;
    score: number;
    comment: string;
    image: string[];
    date: Date;
  }];

  constructor(product?: Partial<Product>) {
    if (product) {
      Object.assign(this, product);
    }
  }
}
