import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './Dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(body: createUserDto) {
    try {
      const { username, email, password, profileImg, description, name } = body;
      const hashPassword: string = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          profileImg,
          description,
          name,
        },
      });
    } catch (error) {
      console.log(error);
      return 'server error';
    }

    return { message: 'user created' };
  }

  async getUniqueUserId(id) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) {
        return { user };
      }
      return 'user not found';
    } catch (error) {
      console.log(error);
      return 'server error';
    }
  }

  async getUniqueUserUsername(username) {
    try {
      const users = await this.prisma.user.findMany({
        where: { username: { contains: username } },
      });
      if (users) {
        return { users };
      }
      return 'user not found';
    } catch (error) {
      console.log(error);
      return 'server error';
    }
  }
  // async editUser(body){
  //   try {
  //     const {username,} = body
  //     const update = await this.prisma.user.update({data:})
  //   } catch (error) {

  //   }
  // }
}
