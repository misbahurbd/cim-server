import { Schema, model } from 'mongoose';
import { IRequest } from './request.interface';

const requestSchema = new Schema<IRequest>(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
    },
    requestFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueDetails: {
      type: String,
      required: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    schedule: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'solved'],
      default: 'pending',
    },
    preferredSchedule: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Request = model<IRequest>('Request', requestSchema);
