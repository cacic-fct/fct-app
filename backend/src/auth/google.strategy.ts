import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { Profile } from './profile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, name, photos } = profile;
    const userProfile: Profile = {
      id,
      displayName: profile.displayName,
      name: { familyName: name.familyName, givenName: name.givenName },
      emails: [{ value: emails[0].value, verified: emails[0].verified }],
      photos: [{ value: photos[0].value }],
    };
    const jwt = await this.authService.validateOAuthLogin(userProfile);
    done(null, { jwt });
  }
}
