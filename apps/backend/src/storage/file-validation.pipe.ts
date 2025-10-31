
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (!this.allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (value.size > maxFileSize) {
      throw new BadRequestException('File size exceeds the limit of 5MB');
    }

    const sanitizedFileName = this.sanitizeFileName(value.originalname);
    value.originalname = sanitizedFileName;

    return value;
  }

  private sanitizeFileName(fileName: string): string {
    const extension = extname(fileName);
    const baseName = fileName.replace(extension, '');
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_\.]/g, '');
    return `${sanitizedBaseName}${extension}`;
  }
}
