import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [UsersModule, AuthModule, FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
