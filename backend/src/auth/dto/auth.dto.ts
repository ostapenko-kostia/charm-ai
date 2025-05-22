import { UserDto } from './user.dto';

export class AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
