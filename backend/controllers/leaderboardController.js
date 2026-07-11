import User from '../models/User.js';

/**
 * @desc    Get leaderboard rankings (top Quick Play scores)
 * @route   GET /api/leaderboard
 * @access  Public
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { mode } = req.query;

    if (mode === 'daily') {
      // Find all users with a daily score > 0, sorted by highestDailyScore descending
      const users = await User.find({ highestDailyScore: { $gt: 0 } })
        .select('username highestDailyScore totalDailyGames totalDailyWins')
        .sort({ highestDailyScore: -1 })
        .limit(100);

      const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        userId: user._id,
        username: user.username,
        score: user.highestDailyScore,
        totalGames: user.totalDailyGames,
        totalWins: user.totalDailyWins,
      }));

      return res.status(200).json({
        success: true,
        count: leaderboard.length,
        leaderboard,
      });
    }

    // Default: quickplay
    const users = await User.find({ highestQuickPlayScore: { $gt: 0 } })
      .select('username highestQuickPlayScore totalQuickPlayGames totalQuickPlayWins')
      .sort({ highestQuickPlayScore: -1 })
      .limit(100); // Return top 100 players

    // Map to custom leaderboard entries
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      score: user.highestQuickPlayScore,
      totalGames: user.totalQuickPlayGames,
      totalWins: user.totalQuickPlayWins,
    }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};
