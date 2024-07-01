export interface IUser {
  name: string;
  email: string;
  phone?: string;
  stateAddress?: string;
  city?: string;
  country: string;
  hashedPassword: string;
  role: 'buyer' | 'seller';
}
