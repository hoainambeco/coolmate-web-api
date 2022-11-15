import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('oders')
export class Oder {
  @ObjectIdColumn() id: ObjectID;
  @Column() customerName: string;
  @Column() numberPro: number;
  @Column() total: number;
  @Column() status: string;
  @Column() paymentMethod: string;
  @Column() placeStore: string;
  @Column() placeCustomer: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;
  @Column()
  userId: string;

  @Column()
  cartId: [string];

  @Column()
  voucherId: [string];

  @Column()
  shippingStatus:string;

  constructor(partial: Partial<Oder>) {
    Object.assign(this, partial);
  }
}
