import User from '../models/User.js';
import QuickPlayResult from '../models/QuickPlayResult.js';
import DailyChallengeResult from '../models/DailyChallengeResult.js';

/**
 * @desc    Get user profile and statistics
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Aggregate QuickPlay statistics
    const quickPlayStats = await QuickPlayResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$score' },
          totalGames: { $sum: 1 },
          bestScore: { $max: '$score' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalHintsUsed: { $sum: '$hintsUsed' },
        },
      },
    ]);

    // Aggregate Daily challenge statistics
    const dailyStats = await DailyChallengeResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$score' },
          totalGames: { $sum: 1 },
          bestScore: { $max: '$score' },
          totalCorrectAnswers: { $sum: { $cond: ['$completed', 1, 0] } },
          totalHintsUsed: { $sum: '$hintsUsed' },
        },
      },
    ]);

    // Format stats response
    const hasQuickPlayStats = quickPlayStats.length > 0;
    const qpStats = hasQuickPlayStats
      ? quickPlayStats[0]
      : { totalPoints: 0, totalGames: 0, bestScore: 0, totalCorrectAnswers: 0, totalHintsUsed: 0 };

    const hasDailyStats = dailyStats.length > 0;
    const dStats = hasDailyStats
      ? dailyStats[0]
      : { totalPoints: 0, totalGames: 0, bestScore: 0, totalCorrectAnswers: 0, totalHintsUsed: 0 };

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        highestQuickPlayScore: user.highestQuickPlayScore,
        totalQuickPlayGames: user.totalQuickPlayGames,
        totalQuickPlayWins: user.totalQuickPlayWins,
        highestDailyScore: user.highestDailyScore || 0,
        totalDailyGames: user.totalDailyGames || 0,
        totalDailyWins: user.totalDailyWins || 0,
      },
      stats: {
        totalGames: (user.totalQuickPlayGames || 0) + (user.totalDailyGames || 0),
        bestScore: Math.max(user.highestQuickPlayScore || 0, user.highestDailyScore || 0),
        totalPoints: qpStats.totalPoints + dStats.totalPoints,
        correctGuesses: qpStats.totalCorrectAnswers + dStats.totalCorrectAnswers,
        hintsUsed: qpStats.totalHintsUsed + dStats.totalHintsUsed,
        modeStats: {
          quickplay: {
            games: user.totalQuickPlayGames || 0,
            bestScore: user.highestQuickPlayScore || 0,
            totalPoints: qpStats.totalPoints,
          },
          daily: {
            games: user.totalDailyGames || 0,
            bestScore: user.highestDailyScore || 0,
            totalPoints: dStats.totalPoints,
            completed: user.totalDailyWins || 0,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
