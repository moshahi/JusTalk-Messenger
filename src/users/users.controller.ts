import { Body, Controller, Post, Get, Query, Patch } from '@nestjs/common';
import { createUserDto } from './Dto/createUser.dto';
import { updateUserDto } from './Dto/updateUserDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  createUser(@Body() body: createUserDto) {
    return this.usersService.create(body);
  }

  @Get('')
  getUniqueUserId(@Query('id') id: string) {
    return this.usersService.getUniqueUserId(+id);
  }

  @Get('')
  getUniqueUserUsername(@Query('username') username: string) {
    return this.usersService.getUniqueUserUsername(username);
  }

  // @Patch('edit')
  // editUser(@Body() body: updateUserDto) {
  //   this.usersService.editUser(body);
  // }
}
