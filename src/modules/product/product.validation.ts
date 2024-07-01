import { z } from 'zod';
import { PRODUCT_COMPATIBILITY, PRODUCT_CONDITION } from './product.constant';

const addProductSchema = z.object({
  title: z.string({
    required_error: 'Product title is required',
    invalid_type_error: 'Product title must be a string',
  }),
  price: z.number({
    required_error: 'Product price is required',
    invalid_type_error: 'Product price must be a number',
  }),
  image: z.string({
    required_error: 'Product image is required',
    invalid_type_error: 'Product image must be a string',
  }),
  quantity: z.number({
    required_error: 'Product quantity is required',
    invalid_type_error: 'Product quantity must be a number',
  }),
  condition: z.enum(Object.values(PRODUCT_CONDITION) as [string, ...string[]], {
    required_error: 'Product condition is required',
    invalid_type_error: 'Product condition must be a string',
  }),
  category: z.string({
    required_error: 'Product category is required',
    invalid_type_error: 'Product category must be a string',
  }),
  brand: z.string({
    required_error: 'Product brand is required',
    invalid_type_error: 'Product brand must be a string',
  }),
  compatibility: z.array(
    z.enum(Object.values(PRODUCT_COMPATIBILITY) as [string, ...string[]], {
      required_error: 'Product compatibility is required',
      invalid_type_error: 'Product compatibility must be a string',
    }),
  ),
  interface: z.array(
    z.string({
      required_error: 'Product interface is required',
      invalid_type_error: 'Product interface must be a string',
    }),
  ),
  capacity: z
    .string({
      invalid_type_error: 'Product interface must be a string',
    })
    .optional(),
  createdBy: z.string({
    required_error: 'Product createdBy is required',
    invalid_type_error: 'Product createdBy must be a string',
  }),
});

export const productValidation = {
  addProductSchema,
};
