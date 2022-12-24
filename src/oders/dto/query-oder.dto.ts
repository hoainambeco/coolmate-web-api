import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Order, OrderBy } from "../../enum/order";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ShippingStatus } from "../../enum/bull";

export class QueryOderDto{
  @IsEnum(ShippingStatus)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: ShippingStatus,
    description: 'shipping status',
  })
  ship: ShippingStatus;

  @IsEnum(ShippingStatus)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: ShippingStatus,
    description: 'order',
  })
  pay: ShippingStatus;
}