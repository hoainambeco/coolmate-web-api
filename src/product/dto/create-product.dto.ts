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

  @ApiProperty({type: () => [Size]})
  @IsNotEmpty()
  size: [Size];
}
export class Size {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({type: () => [Color]})
  @IsObject()
  color: [Color];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
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
  colorCode: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

