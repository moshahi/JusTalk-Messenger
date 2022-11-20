import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
