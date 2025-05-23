import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client';

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}
