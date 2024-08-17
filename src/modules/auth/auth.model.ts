import { Schema, model } from 'mongoose';
import { IToken } from './auth.interface';

const verifyTokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    tokenType: {
      type: String,
      enum: ['Reset', 'Verify'],
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const VerifyToken = model<IToken>('VerifyToken', verifyTokenSchema);
