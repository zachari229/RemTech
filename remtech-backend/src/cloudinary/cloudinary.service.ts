import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: 'video' | 'image' | 'raw',
    folder: string = 'remtech/lessons',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload Cloudinary échoué'));
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string, resourceType: 'video' | 'image' | 'raw') {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}