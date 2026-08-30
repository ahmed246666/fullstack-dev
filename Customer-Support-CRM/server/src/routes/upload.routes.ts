import { Router } from 'express';
import { uploadMiddleware, uploadSingleFile } from '../controllers/upload.controller';

const router = Router();

// Public & authenticated file uploads
router.post('/', uploadMiddleware.single('file'), uploadSingleFile);

export default router;
