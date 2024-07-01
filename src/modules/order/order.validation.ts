import { z } from 'zod';

const newOrderSchema = z.object({
  product: z
    .string({
      required_error: 'Product id is required',
      invalid_type_error: 'Product id must be a string',
    })
    .min(1, { message: 'Product id is required' }),
  customerName: z
    .string({
      required_error: 'Customer name is required',
      invalid_type_error: 'Customer name must be a string',
    })
    .min(1, { message: 'Customer name is required' }),
  customerEmail: z
    .string({
      required_error: 'Customer email is required',
      invalid_type_error: 'Customer email must be a string',
    })
    .min(1, { message: 'Customer email is required' }),
  seller: z
    .string({
      required_error: 'Seller id is required',
      invalid_type_error: 'Seller id must be a string',
    })
    .min(1, { message: 'Seller id is required' }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .min(1, { message: 'Quantity is required' }),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .min(1, { message: 'Price is required' }),
  coupon: z.string().optional(),
  discountPrice: z
    .number({
      invalid_type_error: 'Discount price must be a number',
    })
    .optional(),
  orderAt: z
    .string({
      required_error: 'Order date is required',
      invalid_type_error: 'Order date must be a date',
    })
    .min(1, { message: 'Order date is required' }),
});

export const orderValidation = {
  newOrderSchema,
};
