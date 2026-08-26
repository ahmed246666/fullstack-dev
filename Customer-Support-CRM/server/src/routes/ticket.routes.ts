import { Router } from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  assignTicket,
  submitCSAT
} from '../controllers/ticket.controller';

const router = Router();

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.patch('/:id/status', updateTicketStatus);
router.patch('/:id/assign', assignTicket);
router.post('/:id/csat', submitCSAT);

export default router;
