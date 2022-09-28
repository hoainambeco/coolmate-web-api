import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "../users/users.service";
import { ConfigService } from "../shared/service/config.service";

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
    const { username } = payload;
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }
}