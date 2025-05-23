import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { UserDto } from './dto/user.dto';
import { LoginRequest } from './dto/login.dto';
import { User } from '@prisma/client';
import { AuthResponse } from './dto/auth.dto';
import { AppLogger } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly logger: AppLogger,
  ) {}

  async register(dto: RegisterRequest) {
    const { email, password, firstName, lastName } = dto;

    // Check if the user already exists
    const candidate = await this.prisma.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_SALT_ROUNDS || 12),
    );

    // Save user to the database
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Log the user creation
    this.logger.log(`User created: ${user.id} - ${user.email}`);

    // Issue token pair
    return this.issueTokenPair(user);
  }

  async login(dto: LoginRequest) {
    const { email, password } = dto;

    // Check if the user already exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect email or password');
    }

    // Issue token pair
    return this.issueTokenPair(user);
  }

  async logout(userId: string) {
    // Delete the refresh token from the database
    await this.tokenService.deleteToken(userId);

    // Return success response
    return true;
  }

  async refresh(refreshToken: string | null) {
    // Check if the refresh token is provided
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    // Validate the refresh token
    const decoded = this.tokenService.validateRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedException();
    }

    // Find the user by ID
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    // Issue a new token pair
    return this.issueTokenPair(user);
  }

  private async issueTokenPair(user: User): Promise<AuthResponse> {
    // Create a user DTO
    const userDto = new UserDto(user);

    // Generate JWT tokens
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(userDto);

    // Save the refresh token to the database
    await this.tokenService.saveToken(user.id, refreshToken);

    // Return data
    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }
}
