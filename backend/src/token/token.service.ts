import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  generateTokens(userDto: UserDto) {
    const payload = {
      id: userDto.id,
      email: userDto.email,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, token: string) {
    await this.prisma.refreshToken.upsert({
      where: { userId },
      create: {
        userId,
        token,
      },
      update: {
        token,
      },
    });
  }

  async deleteToken(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  validateAccessToken(token: string): UserDto | null {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return (decoded as UserDto) || null;
  }

  validateRefreshToken(token: string): UserDto | null {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    return (decoded as UserDto) || null;
  }
}
