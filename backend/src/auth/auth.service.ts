import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/roles/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<string> {
    const { id, emails, name, photos } = profile;
    console.log(profile);
    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      user = this.userRepository.create({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        id: id,
        role: [UserRole.USER],
      });
      await this.userRepository.save(user);
    }

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
