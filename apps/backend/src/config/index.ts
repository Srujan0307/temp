import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

const config = envSchema.parse(process.env);

export default config;
