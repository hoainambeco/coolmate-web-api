import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CatalogEnum, FeatureEnum, MaterialEnum, PurposeEnum, StatusProductEnum, StyleEnum } from "../../enum/product";
import { Type } from "class-transformer";
import { Order, OrderBy } from "../../enum/order";

export class QueryProductDto{
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

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    // maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  // @Max(100)
  @IsOptional()
  readonly take: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;

  @IsEnum(StatusProductEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: StatusProductEnum,
    description: 'Product status',
  })
  status: StatusProductEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceTo: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceFrom: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  rating: number;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @IsEnum(StyleEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: StyleEnum,
    description: 'Product status',
  })
  style: StyleEnum;

  @IsEnum(CatalogEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: CatalogEnum,
    description: 'Product status',
  })
  catalog: CatalogEnum;

  @IsEnum(MaterialEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: MaterialEnum,
    description: 'Product status',
  })
  material: MaterialEnum;

  @IsEnum(PurposeEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: PurposeEnum,
    description: 'Product status',
  })
  purpose: PurposeEnum;

  @IsEnum(FeatureEnum)
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    enum: FeatureEnum,
    description: 'Product status',
  })
  feature: FeatureEnum;
}