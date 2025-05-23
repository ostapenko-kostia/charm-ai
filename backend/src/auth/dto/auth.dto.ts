import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class AuthResponse {
  @ApiProperty()
  accessToken: string;
  
  refreshToken: string;

  @ApiProperty()
  user: UserDto;
}
