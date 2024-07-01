import { Date, Types } from 'mongoose';

export interface IRequest {
  title: string;
  brand: string;
  model: string;
  serialNumber?: string;
  issueDetails: string;
  requestFrom: Types.ObjectId;
  provider?: Types.ObjectId;
  schedule?: Date;
  status: 'pending' | 'solved';
  preferredSchedule: Date;
}
