import { Types } from 'mongoose';

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

export interface IForgetPassword {
  email: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export interface IToken {
  userId: Types.ObjectId;
  token: string;
  tokenType: 'Reset' | 'verify';
  expireAt: Date;
}
