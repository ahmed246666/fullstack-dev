import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer.routes';
import ticketRoutes from './routes/ticket.routes';
import noteRoutes from './routes/note.routes';
import knowledgeRoutes from './routes/knowledge.routes';
import userRoutes from './routes/user.routes';
import swaggerRoutes from './openapi/swagger';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AZM Customer Support CRM API',
    timestamp: new Date().toISOString()
  });
});

// OpenAPI & Docs
app.use('/api', swaggerRoutes);

// Feature API Routers
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets', noteRoutes);
app.use('/api/knowledge-base', knowledgeRoutes);
app.use('/api/users', userRoutes);

// 404 Catch-All
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 AZM CRM API Server running on http://localhost:${PORT}`);
    console.log(`📚 OpenAPI Specification: http://localhost:${PORT}/api/openapi.json`);
    console.log(`📖 Swagger Documentation: http://localhost:${PORT}/api/docs`);
  });
}

export default app;
