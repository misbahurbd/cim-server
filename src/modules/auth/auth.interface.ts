export interface IRegister {
  name: string;
  email: string;
  phone?: string;
  stateAddress?: string;
  city?: string;
  country: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface ILogin {
  email: string;
  password: string;
}
