import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  }
});

export default mongoose.model('User', UserSchema);