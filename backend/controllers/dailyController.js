import DailyChallengeResult from '../models/DailyChallengeResult.js';
import User from '../models/User.js';

/**
 * @desc    Get today's daily challenge status for the logged-in user
 * @route   GET /api/daily/status
 * @access  Private
 */
export const getDailyStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dateKey = req.query.date || new Date().toISOString().split('T')[0];

    const result = await DailyChallengeResult.findOne({
      userId,
      date: dateKey,
    });

    // Calculate current daily streak (yesterday's streak if they completed it)
    const getYesterdayKey = (dateStr) => {
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    };
    const yesterdayKey = getYesterdayKey(dateKey);
    const yesterdayResult = await DailyChallengeResult.findOne({
      userId,
      date: yesterdayKey,
    });
    const yesterdayStreak = (yesterdayResult && yesterdayResult.completed) ? (yesterdayResult.streak || 0) : 0;

    res.status(200).json({
      success: true,
      completedToday: Boolean(result && result.completed),
      date: dateKey,
      yesterdayStreak,
      todayResult: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start the Daily Challenge
 * @route   POST /api/daily/start
 * @access  Private
 */
export const startDaily = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dateKey = req.body.date || req.query.date || new Date().toISOString().split('T')[0];

    const existing = await DailyChallengeResult.findOne({
      userId,
      date: dateKey,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        alreadyPlayed: true,
        message: 'Already played today',
        date: dateKey,
      });
    }

    // Lock the daily challenge attempt immediately
    await DailyChallengeResult.create({
      userId,
      date: dateKey,
      completed: false,
    });

    res.status(200).json({
      success: true,
      alreadyPlayed: false,
      message: 'Daily challenge started',
      startTime: Date.now(),
      date: dateKey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Finish the Daily Challenge
 * @route   POST /api/daily/finish
 * @access  Private
 */
export const finishDaily = async (req, res, next) => {
  try {
    const { completed, date, hintsUsed } = req.body;
    const userId = req.user._id;

    if (completed === undefined) {
      res.status(400);
      throw new Error('Please provide completed status');
    }

    // Default to today's date in YYYY-MM-DD if not provided
    const dateKey = date || new Date().toISOString().split('T')[0];

    // Calculate streak and score based on yesterday's result
    const getYesterdayKey = (dateStr) => {
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    };
    const yesterdayKey = getYesterdayKey(dateKey);
    const yesterdayResult = await DailyChallengeResult.findOne({
      userId,
      date: yesterdayKey,
    });

    const yesterdayStreak = (yesterdayResult && yesterdayResult.completed) ? (yesterdayResult.streak || 0) : 0;

    let score = 0;
    let streak = 0;

    if (completed) {
      const hints = Number(hintsUsed) || 0;
      const isSequential = yesterdayStreak > 0;
      score = (100 - hints * 20) + (isSequential ? 20 : 0);
      streak = yesterdayStreak + 1;
    } else {
      score = 0;
      streak = 0;
    }

    // Find and update or insert if doesn't exist (upsert)
    const result = await DailyChallengeResult.findOneAndUpdate(
      { userId, date: dateKey },
      { 
        completed: Boolean(completed),
        score,
        streak,
        hintsUsed: Number(hintsUsed) || 0
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Update User statistics
    const user = await User.findById(userId);
    if (user) {
      user.totalDailyGames = (user.totalDailyGames || 0) + 1;
      if (completed) {
        user.totalDailyWins = (user.totalDailyWins || 0) + 1;
      }
      if (score > (user.highestDailyScore || 0)) {
        user.highestDailyScore = score;
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Daily challenge result recorded successfully',
      result,
      user: user ? {
        id: user._id,
        username: user.username,
        highestDailyScore: user.highestDailyScore,
        totalDailyGames: user.totalDailyGames,
        totalDailyWins: user.totalDailyWins,
      } : null,
    });
  } catch (error) {
    next(error);
  }
};
