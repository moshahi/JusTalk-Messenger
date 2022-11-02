import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './Dto/Login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}
  async login(body: LoginDto, response) {
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

      const token = await this.jwt.signAsync(
        { username, id: user.id },
        { secret: process.env.ACCESS_TOKEN },
      );
      response.setCookie('accesstoken', token);
      return 'user logged in successfuly';
    } catch (error) {
      console.log(error);
      return 'server error';
    }
  }
}
