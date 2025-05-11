// backend/src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI!;
    await mongoose.connect(uri);
    console.log('🗄️  MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
};
