import { Router } from 'express';
import { getMessages, sendMessage, editMessage, deleteMessage, bulkDeleteMessages } from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();
const auth = [authMiddleware, roleMiddleware('student', 'mentor', 'admin')];

router.get('/:roomId', ...auth, getMessages);
router.post('/', ...auth, sendMessage);
router.put('/:id', ...auth, editMessage);
router.delete('/bulk', ...auth, bulkDeleteMessages);
router.delete('/:id', ...auth, deleteMessage);

export default router;
