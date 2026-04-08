import { Router } from 'express';
import { getUsers, toggleBlockUser, deleteUser, assignMentor, getPayments, refundPayment, getStats } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/mentor', assignMentor);
router.get('/payments', getPayments);
router.put('/payments/:id/refund', refundPayment);

export default router;
