import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getVideos, getVideo, markVideoWatched, createVideo, updateVideo, deleteVideo, uploadVideo } from '../controllers/video.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

// Multer sozlama — video fayllar uchun
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = 'uploads/videos';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `video_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) return cb(null, true);
    cb(new Error('Faqat video fayllar qabul qilinadi'));
  }
});

router.get('/', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), getVideos);
router.get('/:id', authMiddleware, roleMiddleware('student', 'mentor', 'admin'), getVideo);
router.post('/watched', authMiddleware, roleMiddleware('student'), markVideoWatched);
router.post('/', authMiddleware, roleMiddleware('admin'), createVideo);
router.post('/upload', authMiddleware, roleMiddleware('admin'), upload.single('video'), uploadVideo);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateVideo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteVideo);

export default router;
