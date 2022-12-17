import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { GenderEnum } from "../../enum/gender";
import { Order, OrderBy } from "../../enum/order";
import { StatusProductEnum } from "../../enum/product";

export class CreateVoucherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(["Còn mã","Hết mã","Lưu trữ"])
  @ApiPropertyOptional({enum: ["Còn mã","Hết mã","Lưu trữ"]})
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: Date;

  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiModelPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  isMonopoly: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
export class queryVoucher{
  @ApiPropertyOptional({
    enum: OrderBy,
    default: OrderBy.CREATED_DATE,
  })
  @IsEnum(OrderBy)
  @IsOptional()
  readonly orderBy: OrderBy = OrderBy.CREATED_DATE;

  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId: string;

  @IsEnum(["Còn mã","Hết mã","Lưu trữ"])
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: ["Còn mã","Hết mã","Lưu trữ"],
    description: 'Voucher status',
    default: 'Còn mã',
  })
  status: ["Còn mã","Hết mã","Lưu trữ"];
}
