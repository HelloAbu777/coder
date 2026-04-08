import { Router } from 'express';
import { getPublicProfile, updateProfile, getLeaderboard } from '../controllers/profile.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:username', getPublicProfile);
router.put('/me', authMiddleware, updateProfile);

export default router;
