import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UserChangePasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly currentPassword: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly newPassword: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly confirmPassword: string;
}

export class UserResetPasswordQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;
}

export class UserResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly otp: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly newPassword: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  readonly confirmPassword: string;
}
