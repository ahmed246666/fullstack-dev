import { Request, Response } from 'express';
import { prisma } from '../db';

export async function getTicketNotes(req: Request, res: Response): Promise<void> {
  try {
    const ticketId = String(
      Array.isArray(req.params.ticketId) ? req.params.ticketId[0] : req.params.ticketId
    );

    const notes = await prisma.note.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, name: true, nameAr: true, role: true, avatarUrl: true }
        }
      }
    });

    res.json({ success: true, data: notes });
  } catch (error: any) {
    console.error('getTicketNotes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notes' });
  }
}

export async function addTicketNote(req: Request, res: Response): Promise<void> {
  try {
    const ticketId = String(
      Array.isArray(req.params.ticketId) ? req.params.ticketId[0] : req.params.ticketId
    );
    const {
      content,
      authorId,
      authorName = 'Agent',
      isInternal = false,
      channel = 'INTERNAL'
    } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Note content cannot be empty' });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ success: false, error: 'Ticket not found' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        ticketId,
        content: content.trim(),
        authorId: authorId || null,
        authorName: authorName.trim(),
        isInternal: Boolean(isInternal),
        channel: channel.toUpperCase()
      },
      include: {
        author: {
          select: { id: true, name: true, nameAr: true, role: true, avatarUrl: true }
        }
      }
    });

    // If ticket is NEW and a reply is sent to customer, update to OPEN and set firstResponseAt
    if (ticket.status === 'NEW' && !isInternal) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: 'OPEN',
          firstResponseAt: new Date()
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        actorName: authorName.trim(),
        action: isInternal ? 'ADD_INTERNAL_NOTE' : 'SEND_CUSTOMER_REPLY',
        entity: 'Note',
        entityId: note.id,
        details: `${isInternal ? 'Internal note' : 'Public reply'} added to ticket ${ticket.ticketNumber}`
      }
    });

    res.status(201).json({ success: true, data: note });
  } catch (error: any) {
    console.error('addTicketNote error:', error);
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
}
