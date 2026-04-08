import { Router } from 'express';
import { createPayment, paymentCallback, checkPayment, testActivate } from '../controllers/payment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create', authMiddleware, createPayment);
router.post('/callback', paymentCallback); // Payme/Click webhook (auth yo'q)
router.get('/status', authMiddleware, checkPayment);
router.post('/test-activate', authMiddleware, testActivate);

export default router;
