import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  voteArticle,
  createArticle,
  updateArticle,
  deleteArticle
} from '../controllers/knowledge.controller';
import { authenticateJWT, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public readers
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/:id/vote', voteArticle);

// Protected authoring / administration
router.post('/', authenticateJWT, requireRole(['ADMIN', 'AGENT']), createArticle);
router.put('/:id', authenticateJWT, requireRole(['ADMIN', 'AGENT']), updateArticle);
router.delete('/:id', authenticateJWT, requireRole(['ADMIN']), deleteArticle);

export default router;

