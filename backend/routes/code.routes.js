import { Router } from 'express';
import { getProjects, getProject, createProject, saveFile, updateProject, deleteFile, deleteProject } from '../controllers/code.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('student'), getProjects);
router.get('/:id', authMiddleware, roleMiddleware('student'), getProject);
router.post('/', authMiddleware, roleMiddleware('student'), createProject);
router.put('/:id/file', authMiddleware, roleMiddleware('student'), saveFile);
router.put('/:id', authMiddleware, roleMiddleware('student'), updateProject);
router.delete('/:id/file/:fileName', authMiddleware, roleMiddleware('student'), deleteFile);
router.delete('/:id', authMiddleware, roleMiddleware('student'), deleteProject);

export default router;
