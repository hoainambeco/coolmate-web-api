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

@Entity('users')
export class User {
  @ObjectIdColumn() id: string;
  @Column() fullName: string;
  @Column() email: string;
  @Column() password: string;
  @Column() otp: string;
  @Column() role: string;
  @Column() createdAt: Date;
  @Column() updatedAt: Date;
  @Column() deletedAt: Date;
  @Column({type: 'enum', enum: StatusAccount, nullable: true, default: StatusAccount.INACTIVE}) status: StatusAccount;
  @Column() isCreate: boolean;
  @Column({type: 'enum', enum: GenderEnum, nullable: true}) gender: string;
  @Column() birthday: Date;
  @Column() address: string;
  @Column() phone: string;
  @Column() avatar: string;

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
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date;

  constructor(favorite?: Partial<Favorite>) {
    if (favorite) {
      Object.assign(this, favorite);
    }
  }
}
