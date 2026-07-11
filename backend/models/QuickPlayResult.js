import mongoose from 'mongoose';

const quickPlayResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  hintsUsed: {
    type: Number,
    required: true,
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
});

const QuickPlayResult = mongoose.model('QuickPlayResult', quickPlayResultSchema);

export default QuickPlayResult;
