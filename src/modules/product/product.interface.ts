import { Types } from 'mongoose';

export interface IProduct {
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  compatibility: string[];
  interface: string[];
  condition: string;
  capacity: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}
