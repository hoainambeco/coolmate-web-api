import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from "./dto/user-login.dto";
import { User } from "../users/entities/user.entity";
import { ErrorException } from "../exceptions/error.exception";
import { UtilsService } from "../providers/util.service";
import { RequestContext } from "../providers/request-context.service";
import { UserDto } from "../users/dto/user.dto";
import { TokenPayloadDto } from "./dto/token-payload.dto";
import { ConfigService } from "../shared/service/config.service";
import { StatusAccount } from "../enum/status-account";

@Injectable()
export class AuthService {
  private static readonly authUserKey = 'user_key';
  constructor(
    private UserService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userLoginDto: UserLoginDto): Promise<UserDto> {
    const user = await this.UserService.findOneByEmail(userLoginDto.email);
    if (!user) {
      throw new ErrorException(
        HttpStatus.NOT_FOUND,
        'USER_NOT_EXIST',
      );
    }
    if(user.status !== StatusAccount.DELETED) {
      const isPasswordValid = await UtilsService.validateHash(
        userLoginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new ErrorException(
          HttpStatus.BAD_REQUEST,
          'PASSWORD_NOT_MATCH',
        );
      }
      return user;
    }
    throw new ErrorException(
      HttpStatus.BAD_REQUEST,
      'USER_IS_DELETED',
    )
  }

  static setAuthUser(user: User) {
    RequestContext.set(this.authUserKey, user);
  }

  static getAuthUser(): User {
    return RequestContext.get(this.authUserKey);
  }
  async login(user) {
    const { username, password } = user;
    const userOne = await this.UserService.findOne(username);
    if (userOne && (await bcrypt.compare(password, userOne.password))) {
      const payload = { username: user.username, sub: user.user_id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Username or password is incorrect');
    }
  }
  async createToken(user: User | UserDto): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
      accessToken: await this.jwtService.signAsync({ id: user.id }, { secret: this.configService.get('JWT_SECRET_KEY'),expiresIn: this.configService.get('JWT_EXPIRATION_TIME') }),
    });
  }

  async googleLogin(req){
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}
