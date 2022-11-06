import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

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
