import { z } from 'zod';

const createCategory = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
});

export const categoryValidation = {
  createCategory,
};
