import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query, Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { LoginPayloadDto } from "./dto/login-payload.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserDto } from "../users/dto/user.dto";
import { UsersService } from "../users/users.service";
import { UserCreatDto } from "../users/dto/user-data.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthUserInterceptor } from "../interceptors/auth-user.interceptor";
import { AuthUser } from "../decorators/auth-user.decorator";
import { User } from "../users/entities/user.entity";
import { UserResetPasswordDto, UserResetPasswordQueryDto } from "./dto/user-change-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { GoogleLoginDto } from "./dto/google-login.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly userService: UsersService) {
  }

  @Post("login") @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: "User info with access token"
  })
  async login(@Body() body: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.AuthService.validateUser(body);
    const token = await this.AuthService.createToken(userEntity);
    return new LoginPayloadDto(userEntity, token);
  }

  @Post("login-google") @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: "User info with access token"
  })
  async loginGoogle(@Body() body: GoogleLoginDto): Promise<LoginPayloadDto> {

    const userEntity = await this.userService.google(body);
    const token = await this.AuthService.createToken(userEntity);
    return new LoginPayloadDto(userEntity, token);
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: "Successfully Registered" })
  async register(@Body() body: UserCreatDto): Promise<UserDto> {
    return await this.userService.registerUser(body);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthUserInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  async getCurrentUser(@AuthUser() user: User) {
    const token = await this.AuthService.createToken(user);
    return {
      user,
      token
    };
  }

  @Get('reset-password-get-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Request send otp mail for reset password' })
  async createResetOtp(@Query(new ValidationPipe({ transform: true }))
      input: UserResetPasswordQueryDto,
  ): Promise<void> {
    return this.userService.createResetOtp(input.email);
  }

  @Post('reset-password-confirm')
  @UseInterceptors(AuthUserInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Reset password' })
  userResetPassword(
    @Body() userResetPasswordDto: UserResetPasswordDto,
  ): Promise<UserDto> {
    return this.userService.userResetPassword(userResetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.AuthService.googleLogin(req)
  }
}
