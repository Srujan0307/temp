import { registerAs } from '@nestjs/config';

export default registerAs('clamav', () => ({
  host: process.env.CLAMAV_HOST,
  port: parseInt(process.env.CLAMAV_PORT || '3310', 10),
  timeout: parseInt(process.env.CLAMAV_TIMEOUT || '5000', 10),
}));
