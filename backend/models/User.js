import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    highestQuickPlayScore: {
      type: Number,
      default: 0,
    },
    totalQuickPlayGames: {
      type: Number,
      default: 0,
    },
    totalQuickPlayWins: {
      type: Number,
      default: 0,
    },
    highestDailyScore: {
      type: Number,
      default: 0,
    },
    totalDailyGames: {
      type: Number,
      default: 0,
    },
    totalDailyWins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // This automatically manages createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);

export default User;
