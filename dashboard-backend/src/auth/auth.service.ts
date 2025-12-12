import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { LoginUserRequest, RegisterUserRequest } from './dto';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserAggregate } from 'src/user/domain';
import { ICachePayload, IJwtPayload } from './domain';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterUserRequest, res: Response) {
    const existing = await this.userService.getUserByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = await this.userService.createUser(dto);
    return this._createSession(user, res);
  }

  async login(dto: LoginUserRequest, res: Response) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this._createSession(user, res);
  }

  async refresh(refreshToken: string, res: Response) {
    try {
      const payload = this.jwtService.verify<IJwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const { sub, jti } = payload;
      const cacheKey = `refresh_token:${sub}:${jti}`;

      const cachedData = await this.cacheManager.get<ICachePayload>(cacheKey);

      if (!cachedData || cachedData.token_hash !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      await this.cacheManager.del(cacheKey);

      const user = await this.userService.getOneUser(sub);
      return this._createSession(user, res);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string | undefined, res: Response) {
    if (refreshToken) {
      try {
        const payload: IJwtPayload | null =
          this.jwtService.decode(refreshToken);

        if (payload?.sub && payload?.jti) {
          const cacheKey = `refresh_token:${payload.sub}:${payload.jti}`;
          await this.cacheManager.del(cacheKey);
        }
      } catch {
        // ignored
      }
    }

    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  private async _createSession(user: UserAggregate, res: Response) {
    const accessTokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      role: user.role,
      jti: uuidv4(),
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);

    const refreshTokenJti = uuidv4();
    const refreshTokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      jti: refreshTokenJti,
      role: user.role,
    };

    const refreshTtl =
      this.configService.get<string>('JWT_REFRESH_TTL') || '7d';

    // @ts-expect-error: Temporary fix for JWT payload type mismatch
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTtl,
    });

    const msToExpire = this._parseDuration(refreshTtl);

    const cachePayload: ICachePayload = {
      id: refreshTokenJti,
      user_id: user.id,
      token_hash: refreshToken,
      expires_at: new Date(Date.now() + msToExpire).toISOString(),
    };

    await this.cacheManager.set(
      `refresh_token:${user.id}:${refreshTokenJti}`,
      cachePayload,
      msToExpire,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('IS_PROD') === 'true',
      sameSite: 'strict',
      maxAge: msToExpire,
    });

    return {
      user,
      accessToken,
    };
  }

  // todo: may find better alternative
  private _parseDuration(duration: string): number {
    if (!isNaN(Number(duration))) {
      return Number(duration);
    }

    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value;
    }
  }
}
