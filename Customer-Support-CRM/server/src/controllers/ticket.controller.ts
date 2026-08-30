import { Request, Response } from 'express';
import { prisma } from '../db';
import { calculateSLADeadlines, computeSLAStatus } from '../services/sla.service';

export async function getTickets(req: Request, res: Response): Promise<void> {
  try {
    const {
      search,
      status,
      priority,
      channel,
      department,
      assignedAgentId,
      customerId,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { ticketNumber: { contains: q } },
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { department: { contains: q } },
        { customer: { name: { contains: q } } },
        { customer: { nameAr: { contains: q } } },
        { customer: { company: { contains: q } } }
      ];
    }


    if (status && status !== 'ALL') {
      where.status = String(status).toUpperCase();
    }

    if (priority && priority !== 'ALL') {
      where.priority = String(priority).toUpperCase();
    }

    if (channel && channel !== 'ALL') {
      where.channel = String(channel).toUpperCase();
    }

    if (department && department !== 'ALL') {
      where.department = String(department);
    }

    if (assignedAgentId) {
      where.assignedAgentId = String(assignedAgentId);
    }

    if (customerId) {
      where.customerId = String(customerId);
    }

    const [total, rawTickets] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              email: true,
              company: true,
              tier: true,
              avatarUrl: true
            }
          },
          assignedAgent: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              email: true,
              department: true,
              avatarUrl: true
            }
          },
          attachments: true,
          _count: {
            select: { notes: true }
          }
        }
      })
    ]);

    const tickets = rawTickets.map((t) => ({
      ...t,
      slaStatus: computeSLAStatus(t)
    }));

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('getTickets error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
  }
}

export async function getTicketById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [{ id }, { ticketNumber: id }]
      },
      include: {
        customer: true,
        attachments: true,
        assignedAgent: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            email: true,
            department: true,
            role: true,
            avatarUrl: true
          }
        },
        notes: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, name: true, nameAr: true, role: true, avatarUrl: true }
            },
            attachments: true
          }
        }
      }
    });

    if (!ticket) {
      res.status(404).json({ success: false, error: 'Ticket not found' });
      return;
    }

    const slaStatus = computeSLAStatus(ticket);

    res.json({
      success: true,
      data: {
        ...ticket,
        slaStatus
      }
    });
  } catch (error: any) {
    console.error('getTicketById error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ticket' });
  }
}

export async function createTicket(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      customerId,
      priority = 'MEDIUM',
      channel = 'WEB_FORM',
      category = 'General',
      department = 'Support',
      assignedAgentId,
      attachments = []
    } = req.body;

    if (!title || !description || !customerId) {
      res
        .status(400)
        .json({ success: false, error: 'Title, description, and customerId are required' });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      res.status(404).json({ success: false, error: 'Customer does not exist' });
      return;
    }

    // Auto-assign to least-busy active agent if not specified
    let finalAgentId = assignedAgentId || null;
    if (!finalAgentId) {
      const activeAgents = await prisma.user.findMany({
        where: { role: { in: ['AGENT', 'ADMIN'] }, status: 'ACTIVE' },
        include: {
          _count: {
            select: {
              assignedTickets: {
                where: { status: { in: ['NEW', 'OPEN', 'PENDING'] } }
              }
            }
          }
        },
        orderBy: {
          assignedTickets: { _count: 'asc' }
        },
        take: 1
      });

      if (activeAgents.length > 0) {
        finalAgentId = activeAgents[0].id;
      }
    }

    // Generate ticket number: TCK-<count + 1001>
    const count = await prisma.ticket.count();
    const ticketNumber = `TCK-${1001 + count}`;

    // Compute SLA Deadlines based on priority policy
    const { responseDueAt, resolutionDueAt } = await calculateSLADeadlines(priority);

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title: title.trim(),
        description: description.trim(),
        status: 'NEW',
        priority: priority.toUpperCase(),
        channel: channel.toUpperCase(),
        category,
        department,
        customerId,
        assignedAgentId: finalAgentId,
        responseDueAt,
        resolutionDueAt,
        ...(attachments && attachments.length > 0
          ? {
              attachments: {
                create: attachments.map((att: any) => ({
                  filename: att.filename,
                  originalName: att.originalName || att.filename,
                  fileUrl: att.fileUrl,
                  mimeType: att.mimeType || 'application/octet-stream',
                  sizeBytes: Number(att.sizeBytes || 0)
                }))
              }
            }
          : {})
      },
      include: {
        customer: true,
        assignedAgent: true,
        attachments: true
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorName: customer.name,
        action: 'CREATE_TICKET',
        entity: 'Ticket',
        entityId: ticket.id,
        details: `Ticket ${ticketNumber} created via ${channel} with priority ${priority}${finalAgentId ? ` (Auto-assigned to agent)` : ''}`
      }
    });

    res.status(201).json({
      success: true,
      data: {
        ...ticket,
        slaStatus: computeSLAStatus(ticket)
      }
    });
  } catch (error: any) {
    console.error('createTicket error:', error);
    res.status(500).json({ success: false, error: 'Failed to create ticket' });
  }
}


export async function updateTicketStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const { status, actorName = 'System' } = req.body;

    const allowedStatuses = ['NEW', 'OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];
    if (!status || !allowedStatuses.includes(status.toUpperCase())) {
      res
        .status(400)
        .json({ success: false, error: `Status must be one of: ${allowedStatuses.join(', ')}` });
      return;
    }

    const currentTicket = await prisma.ticket.findUnique({ where: { id } });
    if (!currentTicket) {
      res.status(404).json({ success: false, error: 'Ticket not found' });
      return;
    }

    const newStatus = status.toUpperCase();
    const updateData: any = { status: newStatus };

    // Set first response timestamp if moving from NEW to OPEN/PENDING
    if (currentTicket.status === 'NEW' && newStatus !== 'NEW' && !currentTicket.firstResponseAt) {
      updateData.firstResponseAt = new Date();
    }

    // Set resolvedAt timestamp
    if ((newStatus === 'RESOLVED' || newStatus === 'CLOSED') && !currentTicket.resolvedAt) {
      updateData.resolvedAt = new Date();
    } else if (newStatus !== 'RESOLVED' && newStatus !== 'CLOSED' && currentTicket.resolvedAt) {
      updateData.resolvedAt = null; // Reopened
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        assignedAgent: true
      }
    });

    await prisma.auditLog.create({
      data: {
        actorName,
        action: 'UPDATE_STATUS',
        entity: 'Ticket',
        entityId: id,
        details: `Status changed from ${currentTicket.status} to ${newStatus}`
      }
    });

    res.json({
      success: true,
      data: {
        ...updated,
        slaStatus: computeSLAStatus(updated)
      }
    });
  } catch (error: any) {
    console.error('updateTicketStatus error:', error);
    res.status(500).json({ success: false, error: 'Failed to update ticket status' });
  }
}

export async function assignTicket(req: Request, res: Response): Promise<void> {
  try {
    const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const { assignedAgentId, department, actorName = 'System' } = req.body;

    let agentName = 'Unassigned';
    if (assignedAgentId) {
      const agent = await prisma.user.findUnique({ where: { id: assignedAgentId } });
      if (!agent) {
        res.status(404).json({ success: false, error: 'Agent not found' });
        return;
      }
      agentName = agent.name;
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        assignedAgentId: assignedAgentId || null,
        ...(department && { department })
      },
      include: {
        customer: true,
        assignedAgent: true
      }
    });

    await prisma.auditLog.create({
      data: {
        actorName,
        action: 'ASSIGN_TICKET',
        entity: 'Ticket',
        entityId: id,
        details: `Assigned to ${agentName}${department ? ` in department ${department}` : ''}`
      }
    });

    res.json({
      success: true,
      data: {
        ...updated,
        slaStatus: computeSLAStatus(updated)
      }
    });
  } catch (error: any) {
    console.error('assignTicket error:', error);
    res.status(500).json({ success: false, error: 'Failed to assign ticket' });
  }
}

export async function submitCSAT(req: Request, res: Response): Promise<void> {
  try {
    const id = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const { csatRating, csatFeedback } = req.body;

    const ratingNum = parseInt(csatRating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res
        .status(400)
        .json({ success: false, error: 'CSAT rating must be an integer between 1 and 5' });
      return;
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        csatRating: ratingNum,
        csatFeedback: csatFeedback?.trim() || null
      }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('submitCSAT error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit CSAT feedback' });
  }
}
