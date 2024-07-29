import { UserRole } from 'src/roles/roles.enum';

export class CreateUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  role: UserRole[];
}
