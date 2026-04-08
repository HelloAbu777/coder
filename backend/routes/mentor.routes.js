import { Router } from 'express';
import { getStudents, getStudent } from '../controllers/mentor.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('mentor', 'admin'));

router.get('/students', getStudents);
router.get('/students/:id', getStudent);

export default router;
