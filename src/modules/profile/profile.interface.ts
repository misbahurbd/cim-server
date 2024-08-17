import { Schema } from 'mongoose';

export interface IProfile {
  name: string;
  email: string;
  profilePhoto: string;
  mobile: string;
  address: string;
  city: string;
  country: string;
  user: Schema.Types.ObjectId;
}
