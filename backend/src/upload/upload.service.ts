import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  async uploadFileToExternalService(file: Express.Multer.File): Promise<any> {
    const form = new FormData();

    // Convert the image to WebP format using sharp
    const webpBuffer = await sharp(file.buffer).webp().toBuffer();

    form.append('file', webpBuffer, {
      filename: file.originalname.replace(/\.[^/.]+$/, '') + '.webp',
      contentType: 'image/webp',
    });

    try {
      const response = await axios.post(
        `${process.env.SEAWEEDFS_IP}${file.originalname.replace(/\.[^/.]+$/, '') + '.webp'}`,
        // Only for test purpose, need to modify
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
