import { z } from 'zod';

export const filingMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  dueDate: z.date(),
});
