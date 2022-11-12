import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional()
  image: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

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
  rating: number;

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
  image: string[];

  @ApiProperty({type: () => [Size]})
  @IsObject()
  @IsNotEmpty()
  size: [Size];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

