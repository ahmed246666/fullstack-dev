import { Router } from 'express';
import {
  getAgents,
  getCannedResponses,
  getSLAPolicies,
  getAnalytics
} from '../controllers/user.controller';

const router = Router();

router.get('/agents', getAgents);
router.get('/canned-responses', getCannedResponses);
router.get('/sla-policies', getSLAPolicies);
router.get('/analytics', getAnalytics);

export default router;
