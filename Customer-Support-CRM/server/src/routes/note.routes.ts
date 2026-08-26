import { Router } from 'express';
import { getTicketNotes, addTicketNote } from '../controllers/note.controller';

const router = Router({ mergeParams: true });

router.get('/:ticketId/notes', getTicketNotes);
router.post('/:ticketId/notes', addTicketNote);

export default router;
