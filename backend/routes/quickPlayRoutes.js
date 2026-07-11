import express from 'express';
import {
  startQuickPlay,
  finishQuickPlay,
  getQuickPlayHistory,
} from '../controllers/quickPlayController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, startQuickPlay);
router.post('/finish', protect, finishQuickPlay);
router.get('/history', protect, getQuickPlayHistory);

export default router;
