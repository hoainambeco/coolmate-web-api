import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { GenderEnum } from "../../enum/gender";
import { CatalogEnum, FeatureEnum, MaterialEnum, PurposeEnum, StyleEnum } from "../../enum/product";

@Entity('product')
export class Product {
  @ObjectIdColumn() id: ObjectID;
  @Column() modelID: string;
  @Column() type: string;
  @Column() productName: string;
  @Column() image: string[];
  @Column() status: string;
  @Column() cmtCount: number;
  @Column() productCount: number;
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
  @Column({type: 'enum', enum: StyleEnum, nullable: false}) style: string
  @Column({type: 'enum', enum: CatalogEnum, nullable: false}) catalog: string;
  @Column({type: 'enum', enum: MaterialEnum, nullable: false}) material : string;
  @Column({type: 'enum', enum: PurposeEnum, nullable: false}) purpose : [string];
  @Column({type: 'enum', enum: FeatureEnum, nullable: false}) feature : [string];
  @Column() color: [
    {
      name: string;
      image: string[];
      size: [
        {
          name: string;
          productCount: number;
        },
      ];
    },
  ];
  @Column( {default: []}) rating: [
    {
      userId: string;
      modelID: string;
      score: number;
      comment: string;
      image: string[];
      date: Date;
    },
  ];

  constructor(product?: Partial<Product>) {
    if (product) {
      Object.assign(this, product);
    }
  }
}
