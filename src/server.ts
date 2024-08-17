/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { isAfter } from 'date-fns';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb_url as string);
    app.listen(config.port, () => {
      console.log(`Server listen on PORT ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

connectDB();
