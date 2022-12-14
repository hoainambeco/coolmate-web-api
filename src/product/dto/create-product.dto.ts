import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { GenderEnum } from "../../enum/gender";
import { CatalogEnum, FeatureEnum, MaterialEnum, PurposeEnum, StyleEnum } from "../../enum/product";
import { Type } from "class-transformer";
import { Double } from "typeorm";

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  modelID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiPropertyOptional()
  image: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdAt: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  PromotionalPrice: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Double)
  rebate: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(StyleEnum)
  @ApiPropertyOptional({enum: StyleEnum})
  style: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CatalogEnum)
  @ApiPropertyOptional({enum: CatalogEnum})
  catalog: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(MaterialEnum)
  @ApiPropertyOptional({enum: MaterialEnum})
  material: string;

  @IsArray()
  @IsNotEmpty()
  @IsEnum(PurposeEnum,{each: true})
  @ApiProperty({isArray: true,enum: PurposeEnum})
  purpose: string[];

  @IsArray()
  @IsNotEmpty()
  @IsEnum(FeatureEnum , {each: true})
  @ApiProperty({ isArray: true,enum: FeatureEnum})
  readonly feature: string[];

  @ApiProperty({type: () => [Color]})
  @IsNotEmpty()
  color: [Color];
}
export class Size {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productCount: number;
}
export class rating {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional()
  image: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: Date;
}

export class Color {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  colorCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string[];

  @ApiProperty({type: () => [Size]})
  @IsObject()
  @IsNotEmpty()
  size: [Size];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

