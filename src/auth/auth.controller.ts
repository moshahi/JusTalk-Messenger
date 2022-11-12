import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dto/Login.dto';
import { Request, Response } from 'express';
import { RefreshDto } from './Dto/refresh.dto';
import { logOutDto } from './Dto/logOut.dto';
import { AuthenticateGuard } from 'src/shared/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto, @Res() response: Response) {
    return this.authService.login(body, response);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(+body.id, req, res);
  }

  // @UseGuards(AuthenticateGuard)
  @Post('logout')
  logout(@Body() body: logOutDto, @Res() response: Response) {
    return this.authService.logOut(+body.id, response);
  }
}
