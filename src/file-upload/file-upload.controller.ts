import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { destination, filename } from '../shared/filefunctions';

@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: 'uploads/',
      storage: diskStorage({ destination, filename }),
    }),
  )
  uploadImg(@UploadedFile() file: Express.Multer.File) {
    return { success: true, message: 'file uploaded', data: file.path };
  }
}
