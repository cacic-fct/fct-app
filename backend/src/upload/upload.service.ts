import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  async uploadFileToExternalService(file: Express.Multer.File): Promise<any> {
    const form = new FormData();

    // Convert the image to AVIF format using sharp
    const avifBuffer = await sharp(file.buffer).avif().toBuffer();
    const filenameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');

    form.append('file', avifBuffer, {
      // This regex removes the file extension from the original filename
      filename: filenameWithoutExtension + '.avif',
      contentType: 'image/avif',
    });

    try {
      const response = await axios.post(
        `${process.env.SEAWEEDFS_IP}${filenameWithoutExtension + '.avif'}`,
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
