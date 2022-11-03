import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({ required: true, example: 'justalk' })
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @ApiProperty({ required: true, example: 'example@gmail.com' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ required: true, example: 'hello12345' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  profileImg?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  ref_token?: string;
}
