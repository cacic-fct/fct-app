import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import { TransformedImage } from './upload.interface';

@Injectable()
export class UploadService {
  async uploadFileToExternalService(file: TransformedImage): Promise<any> {
    const form = new FormData();
    form.append('file', file.image, {
      filename: file.name + '.avif',
      contentType: 'image/avif',
    });
    try {
      const response = await axios.post(
        `${process.env.SEAWEEDFS_IP}${file.name + '.avif'}`,
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
