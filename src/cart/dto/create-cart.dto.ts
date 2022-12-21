import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductDto } from "../../product/dto/product.dto";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({type: () => [CreateCartProductDto]})
  @IsArray()
  @Type(() => CreateCartProductDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  products: [CreateCartProductDto];
}
export class CreateCartProductDto {
  @IsString()
  @ApiProperty({ format: 'string' })
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  colorName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sizeName: string;
}

export class UpdateItemCartsDto{

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  colorName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sizeName: string;
}