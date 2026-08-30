import { Router } from 'express';
import {
  getAgents,

  getCannedResponses,
  getSLAPolicies,
  updateSLAPolicy,
  getAnalytics,
  getAuditLogs,
  exportReportCSV
} from '../controllers/user.controller';
import { authenticateJWT, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public / Agent endpoints
router.get('/agents', getAgents);
router.get('/canned-responses', getCannedResponses);
router.get('/sla-policies', getSLAPolicies);
router.get('/analytics', getAnalytics);
router.get('/export-report', exportReportCSV);

// Admin-only protected endpoints
router.get('/audit-logs', authenticateJWT, requireRole(['ADMIN']), getAuditLogs);
router.put('/sla-policies/:priority', authenticateJWT, requireRole(['ADMIN']), updateSLAPolicy);

export default router;


