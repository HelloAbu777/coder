import { Router } from 'express';
import { getVideos, getVideo, markVideoWatched, createVideo, updateVideo, deleteVideo } from '../controllers/video.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), getVideos);
router.get('/:id', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), getVideo);
router.post('/watched', authMiddleware, roleMiddleware('student'), markVideoWatched);
router.post('/', authMiddleware, roleMiddleware('admin'), createVideo);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateVideo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteVideo);

export default router;
