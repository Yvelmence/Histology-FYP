import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://yvelmencedanub:TTvRwpvktH1dXhHd@fyp.stpzo.mongodb.net/";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;