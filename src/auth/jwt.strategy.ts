import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "../users/users.service";
import { ConfigService } from "../shared/service/config.service";
import { ErrorException } from "../exceptions/error.exception";
import { CodeMessage } from "../enum/code-message";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private userService: UsersService, configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any): Promise<any> {
    console.log(payload);
    const { id, iat, exp } = payload;
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new ErrorException(
        HttpStatus.UNAUTHORIZED,
        CodeMessage.UNAUTHORIZED,
      );
    }
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }
}