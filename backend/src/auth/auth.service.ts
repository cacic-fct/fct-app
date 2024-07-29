import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/roles/roles.enum';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.userRole,
    }; // Include role
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
