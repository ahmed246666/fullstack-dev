import { Router } from 'express';
import { getArticles, getArticleBySlug, voteArticle } from '../controllers/knowledge.controller';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/:id/vote', voteArticle);

export default router;
