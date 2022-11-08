import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './Dto/Login.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}
  async login(body: LoginDto, response: Response) {
    try {
      const { username, password } = body;
      const user = await this.prisma.user.findUnique({ where: { username } });

      if (!user) {
        return new BadRequestException('username not found!');
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return new BadRequestException('username or password not match');
      }

      const tokens = await this.generateTokens(
        user.id,
        user.username,
        true,
        true,
      );
      await this.refTokenOperation(user.id, tokens.refreshToken);
      response.cookie('reftoken', tokens.refreshToken, { httpOnly: true });
      return {
        message: 'user logged in successfuly',
        acctoken: tokens.accessToken,
      };
    } catch (error) {
      console.log(error);
      return 'server error';
    }
  }
  async logOut(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { ref_token: 'null' },
    });
    return 'user logged out successfully';
  }
  async refTokenOperation(userId: number, reftoken: string) {
    const hashToken: string = bcrypt.hash(reftoken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { ref_token: hashToken },
    });
  }

  async generateTokens(userId, username, acctoken = true, reftoken = false) {
    if (acctoken && reftoken) {
      const accessToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.ACCESS_TOKEN, expiresIn: '20m' },
      );
      const refreshToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' },
      );
      return { refreshToken, accessToken };
    } else if (acctoken && !reftoken) {
      const accessToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.ACCESS_TOKEN, expiresIn: '20m' },
      );
      return { accessToken };
    } else if (!acctoken && reftoken) {
      const refreshToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' },
      );
      return { refreshToken };
    }
  }
}
