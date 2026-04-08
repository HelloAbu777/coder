import { Router } from 'express';
import { getMyCertificates, generateCertificate } from '../controllers/certificate.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('student', 'admin'), getMyCertificates);
router.post('/generate', authMiddleware, roleMiddleware('student'), generateCertificate);

export default router;
