import QuickPlayResult from '../models/QuickPlayResult.js';
import User from '../models/User.js';

/**
 * @desc    Start a Quick Play session
 * @route   POST /api/quickplay/start
 * @access  Private
 */
export const startQuickPlay = async (req, res, next) => {
  try {
    // Simple start endpoint to register sessions if needed
    res.status(200).json({
      success: true,
      message: 'Quick Play session started',
      startTime: Date.now(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Finish a Quick Play session and update stats
 * @route   POST /api/quickplay/finish
 * @access  Private
 */
export const finishQuickPlay = async (req, res, next) => {
  try {
    const { score, correctAnswers, hintsUsed } = req.body;
    const userId = req.user._id;

    if (score === undefined || correctAnswers === undefined || hintsUsed === undefined) {
      res.status(400);
      throw new Error('Please provide score, correctAnswers, and hintsUsed');
    }

    // Save result to history
    const result = await QuickPlayResult.create({
      userId,
      score: Number(score),
      correctAnswers: Number(correctAnswers),
      hintsUsed: Number(hintsUsed),
    });

    // Update User statistics
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.totalQuickPlayGames = (user.totalQuickPlayGames || 0) + 1;

    // Define win: successfully got all 3 rounds correct (Perfect Game)
    if (Number(correctAnswers) === 3) {
      user.totalQuickPlayWins = (user.totalQuickPlayWins || 0) + 1;
    }

    // If new score is higher than highest score, update it
    let highscoreUpdated = false;
    if (Number(score) > (user.highestQuickPlayScore || 0)) {
      user.highestQuickPlayScore = Number(score);
      highscoreUpdated = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Quick Play result saved successfully',
      result,
      highscoreUpdated,
      user: {
        id: user._id,
        username: user.username,
        highestQuickPlayScore: user.highestQuickPlayScore,
        totalQuickPlayGames: user.totalQuickPlayGames,
        totalQuickPlayWins: user.totalQuickPlayWins,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's Quick Play history
 * @route   GET /api/quickplay/history
 * @access  Private
 */
export const getQuickPlayHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const history = await QuickPlayResult.find({ userId }).sort({ playedAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};
