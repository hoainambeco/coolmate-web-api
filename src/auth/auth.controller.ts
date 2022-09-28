import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { LoginPayloadDto } from "./dto/login-payload.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  @Post('login')@HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async login(@Body() body: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.AuthService.validateUser(body);
    const token = await this.AuthService.createToken(userEntity);
    return new LoginPayloadDto(userEntity, token);
  }
}
