import { Body, Controller, Get, Post, Req, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dto/Login.dto';
import { Request, Response } from 'express';
import { RefreshDto } from './Dto/refresh.dto';
import { logOutDto } from './Dto/logOut.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto, @Res() response: Response) {
    return this.authService.login(body, response);
  }

  @Get('refresh/:id')
  refresh(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    return this.authService.refresh(+id, req, res);
  }

  @Post('logout')
  logout(@Body() body: logOutDto, @Res() response: Response) {
    return this.authService.logOut(+body.id, response);
  }
}
