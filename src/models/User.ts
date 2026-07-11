import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    membership: {
      type: String,
      enum: ['none', 'silver', 'gold', 'platinum'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
