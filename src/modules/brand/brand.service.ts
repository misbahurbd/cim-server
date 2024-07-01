import { IBrand } from './brand.interface';
import { Brand } from './brand.model';

const createBrand = async (payload: IBrand) => {
  const brand = await Brand.create(payload);
  return brand;
};

const getAllBrand = async () => {
  const brand = await Brand.find();
  return brand;
};

export const brandService = {
  createBrand,
  getAllBrand,
};
