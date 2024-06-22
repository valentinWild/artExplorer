import { defineEventHandler } from 'h3';
import mongoose from 'mongoose';
import connectDB from '../utils/db.js';

export default defineEventHandler(async () => {
  if (mongoose.connection.readyState === 1) {
    return { message: 'MongoDB is connected' };
  } else {
    connectDB();
    return { message: 'MongoDB is not connected ' + mongoose.connection.readyState };
  }
});