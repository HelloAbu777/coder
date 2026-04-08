import { Router } from 'express';
import { getMessages, sendMessage, deleteMessage } from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.get('/:roomId', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), getMessages);
router.post('/', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), sendMessage);
router.delete('/:id', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), deleteMessage);

export default router;
