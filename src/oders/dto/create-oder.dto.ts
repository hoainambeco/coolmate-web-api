import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { PaymentMethod, ShippingStatus } from "../../enum/bull";
import { CreateCartProductDto } from "../../cart/dto/create-cart.dto";
import { Type } from "class-transformer";

export class CreateOderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string;

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

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  voucherId: string[];

  @ApiProperty({enum : ShippingStatus, default: ShippingStatus.CHO_XAC_NHAN})
  @IsEnum(ShippingStatus)
  @IsNotEmpty()
  @IsString()
  shippingStatus:string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;

}
export class CreateOderByProductDto {
  @ApiProperty({default: null})
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({default: null})
  @IsNumber()
  @IsNotEmpty()
  numberPro: number;

  @ApiProperty({default: null})
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

  @ApiProperty({default: null})
  @IsString()
  @IsNotEmpty()
  placeStore: string;

  @ApiProperty({default: null})
  @IsString()
  @IsNotEmpty()
  placeCustomer: string;

  @ApiPropertyOptional({default: null})
  @IsString()
  @IsOptional()
  cartId: string;

  @ApiPropertyOptional({type: () => [CreateCartProductDto], default: null})
  @IsArray()
  @Type(() => CreateCartProductDto)
  @ValidateNested({ each: true })
  @IsOptional()
  cartProduct: [CreateCartProductDto] | null;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
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
