import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberPro: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeStore: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeCustomer: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  cartId: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  voucherId: [string];
}
