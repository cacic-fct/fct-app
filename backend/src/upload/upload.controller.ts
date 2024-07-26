import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

// Helper function to generate a unique filename
const generateFilename = (originalname: string): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + extname(originalname);
};

@Controller('upload')
export class UploadController {
  constructor() {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'), // Specify the directory to save the file
        filename: (req, file, callback) => {
          const filename = generateFilename(file.originalname);
          callback(null, filename); // Save file with a unique name
        },
      }),
      fileFilter: (req, file, callback) => {
        // Check file type
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/)) {
          return callback(
            new Error('Only image and PDF files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
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
  ) {
    return file;
  }
}
