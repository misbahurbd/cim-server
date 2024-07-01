import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategory = async (payload: ICategory) => {
  const category = await Category.create(payload);
  return category;
};

const getAllCategory = async () => {
  const category = await Category.find();
  return category;
};

export const categoryService = {
  createCategory,
  getAllCategory,
};
