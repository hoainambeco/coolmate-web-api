import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GenderEnum } from "../../enum/gender";

export class UserDto {
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

  @ApiProperty()
  isDeleted: boolean;

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
}