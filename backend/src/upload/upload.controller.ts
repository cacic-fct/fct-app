import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { TransformedImage } from './upload.interface';
import { ImagePipe } from './upload.pipe';

// Helper function to generate a unique filename
const generateFilename = (originalname: string): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + extname(originalname);
};

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|avif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 50000, // File size limit in bytes (50KB in this example)
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
      ImagePipe,
    )
    file: TransformedImage,
  ): Promise<any> {
    return this.uploadService.uploadFileToExternalService(file);
  }
}
