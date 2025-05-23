import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { AuthGuard } from './guard/auth.guard';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { TOKEN } from 'src/common/typing/enums';
import { LoginRequest } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(AuthResponse) }] },
  })
  @Post('register')
  async register(
    @Body() dto: RegisterRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response;
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(AuthResponse) }] },
  })
  @Post('login')
  async login(
    @Body() dto: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response;
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({
    schema: { type: 'boolean', example: true },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie(TOKEN.REFRESH_TOKEN);
    return true;
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(AuthResponse) }] },
  })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.refreshToken;
    const { refreshToken, ...response } = await this.authService.refresh(token);

    res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response;
  }
}
