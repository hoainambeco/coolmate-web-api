import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GenderEnum } from "../../enum/gender";
import { Favorite, User } from "../entities/user.entity";
import { StatusAccount } from "../../enum/status-account";

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiPropertyOptional({type: 'enum', enum: StatusAccount})
  status: string;

  @ApiPropertyOptional({type: 'enum', enum: GenderEnum})
  gender: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  otp: string;

  @ApiProperty()
  isCreate: boolean;

  constructor(entity : User) {
    this.id = entity.id.toString();
    this.fullName = entity.fullName;
    this.email = entity.email;
    this.role = entity.role;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
    this.status = entity.status
    this.gender= entity.gender;
    this.birthday = entity.birthday;
    this.address = entity.address;
    this.phone = entity.phone;
    this.avatar = entity.avatar;
    this.isCreate = entity.isCreate;
    this.otp = entity.otp;
  }
}

export class FavoriteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  constructor(entity : Favorite) {
    this.id = entity.id.toString();
    this.userId = entity.userId;
    this.productId = entity.productId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}