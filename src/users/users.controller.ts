import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersDto } from './Dto/getUsers.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getFilteredUsers(@Query() query: GetUsersDto) {
    return this.usersService.getFilteredUsers(query);
  }

  // @Patch('edit')
  // editUser(@Body() body: updateUserDto) {
  //   this.usersService.editUser(body);
  // }
}
