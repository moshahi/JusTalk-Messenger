import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from '../auth/Dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { GetUsersDto } from './Dto/getUsers.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getFilteredUsers(query: GetUsersDto) {
    try {
      const { id, username } = query;
      if (id && !username) {
        const user = await this.prisma.user.findUnique({
          where: { id: +id },
          select: {
            username: true,
            email: true,
            description: true,
            profileImg: true,
            avatarColor: true,
            status: true,
          },
        });
        if (user) {
          return { success: true, message: 'user founded', data: user };
        }
        return { success: false, message: 'user not found' };
      }
      if (!id && username) {
        const user = await this.prisma.user.findUnique({
          where: { username },
          select: {
            username: true,
            email: true,
            description: true,
            profileImg: true,
            avatarColor: true,
            status: true,
          },
        });
        if (user) {
          return { success: true, message: 'user founded', data: user };
        }
        return { success: false, message: 'user not found' };
      }
      if (!id && !username) {
        const user = await this.prisma.user.findMany({
          select: {
            username: true,
            email: true,
            description: true,
            profileImg: true,
            avatarColor: true,
            status: true,
          },
        });
        if (user) {
          return { success: true, message: 'users founded', data: user };
        }
        return { success: false, message: 'user not found' };
      }
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
