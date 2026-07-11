import mongoose from 'mongoose';

const dailyChallengeResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: String, // Stored in YYYY-MM-DD format
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  streak: {
    type: Number,
    required: true,
    default: 0,
  },
  hintsUsed: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Compound index to ensure a user can only have one entry per daily date
dailyChallengeResultSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyChallengeResult = mongoose.model('DailyChallengeResult', dailyChallengeResultSchema);

export default DailyChallengeResult;
