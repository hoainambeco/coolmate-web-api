import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { JwtService } from "@nestjs/jwt";
import { config } from 'dotenv';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private jwrService: JwtService) {
    super({
      clientID: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
    const user = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture: profile.photos[0].value,
      accessToken,
    };
    console.log(user);
    return done(null, this.jwrService.sign(user));
  }
}