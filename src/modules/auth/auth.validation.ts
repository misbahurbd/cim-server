import { z } from 'zod';
import { USER_ROLE } from '../user/user.constants';

const registerUserSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name is not valid',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email is not valid',
    })
    .email({ message: 'Email is not valid' }),
  phone: z
    .string({
      invalid_type_error: 'Phone is not valid',
    })
    .optional(),
  stateAddress: z
    .string({
      invalid_type_error: 'State is not valid',
    })
    .optional(),
  city: z
    .string({
      invalid_type_error: 'City is not valid',
    })
    .optional(),
  country: z.string().min(1, { message: 'Country is required' }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password is not valid',
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/gm, {
      message:
        'Password must contain at least one lowercase, one uppercase, and one digit',
    }),
  role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]),
});

const loginUserSchema = z.object({
  email: z
    .string({
      required_error: 'email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

const forgetPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
});

const resetPasswordSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password is not valid',
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/gm, {
      message:
        'Password must contain at least one lowercase, one uppercase, and one digit',
    }),
  confirmPassword: z.string().min(1, 'Confirm password is requried'),
});

export const authValidation = {
  registerUserSchema,
  loginUserSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
