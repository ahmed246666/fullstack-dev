import { Router } from 'express';
import { chatWithBot } from '../controllers/ai.controller';

const router = Router();

// Public & Portal AI Chatbot
router.post('/chatbot', chatWithBot);

export default router;
