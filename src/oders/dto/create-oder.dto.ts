import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentMethod, ShippingStatus } from "../../enum/bull";

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

  @ApiProperty({enum : ShippingStatus, default: ShippingStatus.CHUA_THANH_TOAN})
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({enum: PaymentMethod, default: PaymentMethod.COD})
  @IsString()
  @IsEnum(PaymentMethod)
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
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  voucherId: string[];

  @ApiProperty({enum : ShippingStatus, default: ShippingStatus.CHO_XAC_NHAN})
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  @IsString()
  shippingStatus:string;

}
export class UpdateShippingStatusDto{
  @ApiProperty({enum : ShippingStatus, default: ShippingStatus.CHO_XAC_NHAN})
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  @IsString()
  shippingStatus:string;
}
