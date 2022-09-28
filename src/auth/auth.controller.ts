import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from "@nestjs/common";
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
  getCurrentUser(@AuthUser() user: User) {
    return user;
  }
}
