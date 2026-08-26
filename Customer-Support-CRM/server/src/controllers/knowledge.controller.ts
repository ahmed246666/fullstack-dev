import { Request, Response } from 'express';
import { prisma } from '../db';

export async function getArticles(req: Request, res: Response): Promise<void> {
  try {
    const { search, category } = req.query;

    const where: any = { isPublished: true };

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q } },
        { titleAr: { contains: q } },
        { content: { contains: q } },
        { contentAr: { contains: q } },
        { tags: { contains: q } }
      ];
    }

    if (category && category !== 'ALL') {
      where.category = String(category);
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      orderBy: [{ helpfulVotes: 'desc' }, { createdAt: 'desc' }]
    });

    res.json({ success: true, data: articles });
  } catch (error: any) {
    console.error('getArticles error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch knowledge base articles' });
  }
}

export async function getArticleBySlug(req: Request, res: Response): Promise<void> {
  try {
    const slug = String(Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug);

    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug }
    });

    if (!article) {
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    res.json({ success: true, data: article });
  } catch (error: any) {
    console.error('getArticleBySlug error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch article' });
  }
}

export async function voteArticle(req: Request, res: Response): Promise<void> {
  try {
    const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const { type } = req.body; // HELPFUL | UNHELPFUL

    if (type !== 'HELPFUL' && type !== 'UNHELPFUL') {
      res.status(400).json({ success: false, error: 'Vote type must be HELPFUL or UNHELPFUL' });
      return;
    }

    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: {
        ...(type === 'HELPFUL'
          ? { helpfulVotes: { increment: 1 } }
          : { unhelpfulVotes: { increment: 1 } })
      }
    });

    res.json({ success: true, data: article });
  } catch (error: any) {
    console.error('voteArticle error:', error);
    res.status(500).json({ success: false, error: 'Failed to record vote' });
  }
}
