import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity("product")
export class Product {
  @ObjectIdColumn() id: ObjectID;
  @Column() type: string;
  @Column() productName: string;
  @Column() image: string[];
  @Column() price: number;
  @Column() description: string;
  @Column() createdAt: Date;
  @Column() updatedAt: Date;
  @Column() deletedAt: Date;
  @Column() isDeleted: boolean;
  @Column() status: string;
  @Column() PromotionalPrice: number;
  @Column() size: [{
    name: string;
    color: [{
      name: string;
      colorCode: string
    }];
    quantity: number;
  }];
  @Column() rating: [{
    userId: string;
    rating: number;
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
