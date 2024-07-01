import { z } from 'zod';

const addRequestSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  serialNumber: z.string().optional(),
  issueDetails: z.string().min(1, { message: 'Issue Details is required' }),
  requestFrom: z.string().min(1, { message: 'Request From is required' }),
  preferredSchedule: z
    .string()
    .min(1, { message: 'Preferred Schedule is required' }),
});

const updateRequest = z.object({
  schedule: z.string().min(1, { message: 'Schedule is required' }),
  provider: z.string().min(1, { message: 'Provider id is required' }),
});

export const requestValidation = { addRequestSchema, updateRequest };
