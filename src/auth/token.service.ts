import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Role } from '../enums/role.enum';
import { Tokens } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    role: Role,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.AT_SECRET, expiresIn: '50m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: 'rt-secret', expiresIn: '7d' },
      ),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async updateRtHash(userId: string, refreshToken: string): Promise<void> {
    const hashedRt = await argon2.hash(refreshToken);
    await this.userModel.updateOne({ _id: userId }, { hashRt: hashedRt });
  }

  async clearRtHash(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { hashRt: null });
  }

  async verifyRefreshToken(
    hashRt: string,
    refreshToken: string,
  ): Promise<void> {
    const isMatch = await argon2.verify(hashRt, refreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');
  }
}
