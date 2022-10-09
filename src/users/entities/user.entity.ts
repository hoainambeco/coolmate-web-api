import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { GenderEnum } from "../../enum/gender";

@Entity('users')
export class User {
  @ObjectIdColumn() id: ObjectID;
  @Column() fullName: string;
  @Column() email: string;
  @Column() password: string;
  @Column() otp: string;
  @Column() role: string;
  @Column() createdAt: Date;
  @Column() updatedAt: Date;
  @Column() deletedAt: Date;
  @Column() isDeleted: boolean;
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
