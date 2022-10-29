import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GenderEnum } from "../../enum/gender";

export class UserCreatDto{
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @ApiPropertyOptional()
  email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  @ApiPropertyOptional({enum: GenderEnum})
  gender: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  birthday: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address: string;
}

export class UserUpdateDto{
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  @IsEnum(GenderEnum)
  @ApiPropertyOptional({enum: GenderEnum})
  gender: string;

  @IsDateString()
  @ApiPropertyOptional()
  @IsOptional()
  birthday: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password: string;
}
export class OtpDto{
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  otp: string;
}