import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlacklistService } from './blacklist.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly blacklistService: BlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()();
    if (this.blacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
