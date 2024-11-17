import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDB = async () => {
  try {
    console.log('Initiating connection to MongoDB ...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('C:Error Connecting to MongoDB: ', error.message);
  }
};

export default connectToDB;
