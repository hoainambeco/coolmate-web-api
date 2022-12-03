import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn
} from "typeorm";
import { GenderEnum } from "../../enum/gender";
import { StatusAccount } from "../../enum/status-account";
import { Product } from "../../product/entities/product.entity";

@Entity('users')
export class User {
  @ObjectIdColumn() id: string;
  @Column({default: null}) fullName: string;
  @Column({default: null}) email: string;
  @Column({default: null}) password: string;
  @Column({default: null}) otp: string;
  @Column({default: null}) role: string;
  @Column({default: null}) createdAt: Date;
  @Column({default: null}) updatedAt: Date;
  @Column({default: null}) deletedAt: Date;
  @Column({type: 'enum', enum: StatusAccount, nullable: true, default: StatusAccount.INACTIVE}) status: StatusAccount;
  @Column({default: true}) isCreate: boolean;
  @Column({type: 'enum', enum: GenderEnum, nullable: true}) gender: string;
  @Column({default: null}) birthday: Date;
  @Column({default: null}) address: string;
  @Column({default: null}) phone: string;
  @Column({default: null}) avatar: string;
  @Column({default: null}) chatLink: string;
  @Column({default: null}) phoneActive: string;
  @Column({default: null}) registrationToken: string;

  constructor(user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }
}

@Entity('favorites')
export class Favorite {
  @ObjectIdColumn() id: string;
  @Column() userId: string;
  @Column() productId: string;
  @Column() product : Product;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;

  constructor(favorite?: Partial<Favorite>) {
    if (favorite) {
      Object.assign(this, favorite);
    }
  }
}
