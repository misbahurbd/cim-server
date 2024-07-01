import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { USER_ROLE } from './user.constants';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    stateAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      select: 0,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.hashedPassword;
        return ret;
      },
    },
  },
);

export const User = model<IUser>('User', userSchema);
