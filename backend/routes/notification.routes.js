import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllRead } from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);

export default router;
