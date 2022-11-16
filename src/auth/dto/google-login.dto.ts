import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GoogleLoginDto {
  @IsString()
  @ApiProperty()
  id: string

  @IsString()
  @ApiProperty()
  name: string

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string

  @IsString()
  @ApiProperty()
  firstName: string

  @IsString()
  @ApiProperty()
  lastName: string

  @IsString()
  @ApiProperty()
  picture: string
}