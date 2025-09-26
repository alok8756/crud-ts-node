import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const MONGO_URI: string = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env files alok8756');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB is connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); 
  }
};

export default connectDB;
