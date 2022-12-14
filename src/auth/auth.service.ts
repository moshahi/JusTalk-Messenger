import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './Dto/Login.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { RefreshDto } from './Dto/refresh.dto';
import { createUserDto } from 'src/auth/Dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async create(body: createUserDto, res: Response) {
    try {
      const {
        username,
        email,
        password,
        profileImg,
        description,
        name,
        avatarColor,
      } = body;

      const findUser = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (findUser) {
        return res.status(401).json({ success: false, message: 'user exist!' });
      }
      const hashPassword: string = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          profileImg,
          description,
          name,
          avatarColor,
        },
      });
      const loginBody: LoginDto = {
        username: user.username,
        password,
      };

      return this.login(loginBody, res);
    } catch (error) {
      console.log(error);
      return { success: false, message: 'server error' };
    }
  }

  async login(body: LoginDto, response: Response) {
    try {
      const { username, password } = body;
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (!user) {
        return response
          .status(404)
          .json({ success: false, message: 'user not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(403)
          .json({ success: false, message: 'incorrect password' });
      }

      const tokens = await this.generateTokens(
        user.id,
        user.username,
        true,
        true,
      );
      await this.refTokenOperation(user.id, tokens.refreshToken);
      await response.cookie('reftoken', tokens.refreshToken, {
        httpOnly: true,
      });
      return response.status(200).json({
        message: 'login successfully',
        data: {
          token: tokens.accessToken,
          user,
        },
        success: true,
      });
    } catch (error) {
      console.log(error);
      return { message: 'server error', success: false };
    }
  }
  async logOut(req: Request, res: Response) {
    const reftoken = req.cookies.reftoken;
    if (!reftoken) {
      return res.status(403).json({ success: false, message: 'access denied' });
    }
    const tokenVerify = await this.jwt.verify(reftoken, {
      secret: process.env.REFRESH_TOKEN,
    });

    await this.prisma.user.update({
      where: { id: +tokenVerify.id },
      data: { ref_token: 'null' },
    });
    res.clearCookie('reftoken');
    return res.status(200).json({ message: 'user logged out' });
  }
  async refresh(req: Request, res: Response) {
    try {
      const reftoken = req.cookies.reftoken;

      if (!reftoken) {
        return res
          .status(403)
          .json({ success: false, message: 'access denied' });
      }
      const tokenVerify = await this.jwt.verify(reftoken, {
        secret: process.env.REFRESH_TOKEN,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: +tokenVerify.id },
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'user not found' });
      }
      const isMatch = await bcrypt.compare(reftoken, user.ref_token);
      if (!isMatch) {
        return res
          .status(403)
          .json({ success: false, message: 'access denied' });
      }
      await this.jwt.verifyAsync(reftoken, {
        secret: process.env.REFRESH_TOKEN,
      });
      const token = await this.generateTokens(
        user.id,
        user.username,
        true,
        false,
      );
      return res.status(200).json({
        message: 'generate new access token',
        data: token,
        success: true,
      });
    } catch (error) {
      // console.log(error);
      return res.status(403).json({ message: 'access denied' });
    }
  }
  async refTokenOperation(userId: number, reftoken: string) {
    const hashToken: string = await bcrypt.hash(reftoken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { ref_token: hashToken },
    });
  }

  async generateTokens(userId, username, acctoken = true, reftoken = false) {
    if (acctoken && reftoken) {
      const accessToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.ACCESS_TOKEN, expiresIn: '10m' },
      );
      const refreshToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.REFRESH_TOKEN, expiresIn: '14d' },
      );
      return { refreshToken, accessToken };
    } else if (acctoken && !reftoken) {
      const accessToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.ACCESS_TOKEN, expiresIn: '10m' },
      );
      return { accessToken };
    } else if (!acctoken && reftoken) {
      const refreshToken = await this.jwt.signAsync(
        { id: userId, username },
        { secret: process.env.REFRESH_TOKEN, expiresIn: '14d' },
      );
      return { refreshToken };
    }
  }
}
