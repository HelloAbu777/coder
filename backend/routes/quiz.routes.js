import { Router } from 'express';
import { getQuizByVideo, getCheckpointQuiz, getQuizBySection, submitQuiz, getMyResults, createQuiz, deleteQuiz } from '../controllers/quiz.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.get('/video/:videoId', authMiddleware, roleMiddleware('student', 'admin'), getQuizByVideo);
router.get('/checkpoint/:section', authMiddleware, roleMiddleware('student', 'admin'), getCheckpointQuiz);
router.get('/section/:section', authMiddleware, roleMiddleware('student', 'admin'), getQuizBySection);
router.post('/submit', authMiddleware, roleMiddleware('student'), submitQuiz);
router.get('/my-results', authMiddleware, roleMiddleware('student'), getMyResults);
router.post('/', authMiddleware, roleMiddleware('admin'), createQuiz);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteQuiz);

export default router;
