import { Types } from 'mongoose';

// auth user payload
export interface Payload {
  id: Types.ObjectId;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
