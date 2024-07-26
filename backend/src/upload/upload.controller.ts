import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
// import * as bufferToBlob from 'buffer-to-blob';
import * as FormData from 'form-data';
// Helper function to generate a unique filename
const generateFilename = (originalname: string): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + extname(originalname);
};

@Controller('upload')
export class UploadController {
  constructor() {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|pdf)$/,
        })
        .addMaxSizeValidator({
          maxSize: 50000, // File size limit in bytes (50KB in this example)
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(
        `${process.env.SEAWEEDFS_IP}${file.filename}`,
        form,
        {
          headers: form.getHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to upload file to external service: ${error.message}`,
      );
    }
  }
}
