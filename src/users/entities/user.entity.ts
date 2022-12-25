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
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Voucher } from "../../voucher/entities/voucher.entity";

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

@Entity('notifications')
export class Notification {
  @ObjectIdColumn({default: null}) id: string;
  @Column({default: null}) userId: string;
  @Column({default: null}) title: string;
  @Column({default: null}) content: string;
  @Column({default: null}) file: string;
  @Column({default: null}) status: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn({default: null}) deletedAt: Date;

}
@Entity('favoritesVoucher')
export class FavoriteVoucher {
  @ObjectIdColumn() id: string;
  @Column() userId: string;
  @Column() voucherId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;
  @Column() voucher: Voucher;
  @Column() status: string;
}