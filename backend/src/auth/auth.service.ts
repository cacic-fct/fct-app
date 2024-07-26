import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId }; // Use user ID or email as sub
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
