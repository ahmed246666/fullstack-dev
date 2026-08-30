import { Router } from 'express';
import { login, getMe, register } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Public auth endpoints
router.post('/login', login);
router.post('/register', register);

// Protected current user endpoint
router.get('/me', authenticateJWT, getMe);

export default router;
