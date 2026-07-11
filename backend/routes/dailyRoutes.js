import express from 'express';
import { startDaily, finishDaily, getDailyStatus } from '../controllers/dailyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', protect, getDailyStatus);
router.post('/start', protect, startDaily);
router.post('/finish', protect, finishDaily);

export default router;
