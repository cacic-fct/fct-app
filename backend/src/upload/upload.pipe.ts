import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { TransformedImage } from './upload.interface';

@Injectable()
export class ImagePipe
  implements PipeTransform<Express.Multer.File, Promise<TransformedImage>>
{
  async transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Promise<TransformedImage> {
    try {
      // Convert the image to AVIF format using sharp
      const avifBuffer = await sharp(file.buffer).avif().toBuffer();

      // This regex removes the file extension from the original filename
      const filenameWithoutExtension = file.originalname.replace(
        /\.[^/.]+$/,
        '',
      );

      const image: TransformedImage = {
        image: avifBuffer,
        name: filenameWithoutExtension,
      };

      return image;
    } catch (error) {
      throw new BadRequestException(
        `Image transformation failed: ${error.message}`,
      );
    }
  }
}
