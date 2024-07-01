import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';
import { PRODUCT_COMPATIBILITY, PRODUCT_CONDITION } from './product.constant';

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: Object.values(PRODUCT_CONDITION),
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    brand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Brand',
    },
    compatibility: {
      type: [String],
      enum: Object.values(PRODUCT_COMPATIBILITY),
      required: true,
    },
    interface: {
      type: [String],
      required: true,
    },
    capacity: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ title: 'text' });

export const Product = model<IProduct>('Product', productSchema);
