import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  endpoint: process.env.STORAGE_ENDPOINT,
  bucket: process.env.STORAGE_BUCKET,
  region: process.env.STORAGE_REGION,
  maxFileSize: parseInt(process.env.STORAGE_MAX_FILE_SIZE || '10485760', 10),
  allowedMimeTypes: (process.env.STORAGE_ALLOWED_MIME_TYPES || '').split(','),
}));
