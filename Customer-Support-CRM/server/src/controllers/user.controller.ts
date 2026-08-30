import { Request, Response } from 'express';
import { prisma } from '../db';
import { computeSLAStatus } from '../services/sla.service';

export async function getAgents(req: Request, res: Response): Promise<void> {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: { in: ['AGENT', 'ADMIN'] },
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        _count: {
          select: {
            assignedTickets: {
              where: { status: { in: ['OPEN', 'PENDING', 'NEW'] } }
            }
          }
        }
      }
    });

    res.json({ success: true, data: agents });
  } catch (error: any) {
    console.error('getAgents error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch agents' });
  }
}

export async function getCannedResponses(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = String(category);
    }

    const responses = await prisma.cannedResponse.findMany({ where });
    res.json({ success: true, data: responses });
  } catch (error: any) {
    console.error('getCannedResponses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch canned responses' });
  }
}

export async function getSLAPolicies(req: Request, res: Response): Promise<void> {
  try {
    const policies = await prisma.sLAConfig.findMany({
      orderBy: { responseTimeHours: 'asc' }
    });
    res.json({ success: true, data: policies });
  } catch (error: any) {
    console.error('getSLAPolicies error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch SLA policies' });
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const [totalTickets, openTickets, resolvedTickets, customersCount, tickets, csatAgg] =
      await Promise.all([
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: { in: ['NEW', 'OPEN', 'PENDING'] } } }),
        prisma.ticket.count({ where: { status: { in: ['RESOLVED', 'CLOSED'] } } }),
        prisma.customer.count(),
        prisma.ticket.findMany({
          select: {
            channel: true,
            priority: true,
            status: true,
            resolutionDueAt: true,
            resolvedAt: true
          }
        }),
        prisma.ticket.aggregate({
          _avg: { csatRating: true },
          where: { csatRating: { not: null } }
        })
      ]);

    // Channel Distribution breakdown
    const channelCounts: Record<string, number> = {
      EMAIL: 0,
      WHATSAPP: 0,
      LIVE_CHAT: 0,
      SMS: 0,
      WEB_FORM: 0
    };

    let breachedCount = 0;
    let onTrackCount = 0;

    for (const t of tickets) {
      if (t.channel in channelCounts) {
        channelCounts[t.channel]++;
      }
      const sla = computeSLAStatus(t);
      if (sla === 'BREACHED' || sla === 'RESOLVED_LATE') {
        breachedCount++;
      } else {
        onTrackCount++;
      }
    }

    const slaComplianceRate =
      totalTickets > 0 ? Math.round((onTrackCount / totalTickets) * 100) : 100;

    res.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        resolvedTickets,
        customersCount,
        slaComplianceRate,
        averageCSAT: csatAgg._avg.csatRating ? Number(csatAgg._avg.csatRating.toFixed(1)) : 4.8,
        channelDistribution: channelCounts
      }
    });
  } catch (error: any) {
    console.error('getAnalytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate analytics' });
  }
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            role: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('getAuditLogs error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
}

export async function updateSLAPolicy(req: Request, res: Response): Promise<void> {
  try {
    const { priority } = req.params;
    const { responseTimeHours, resolutionTimeHours, escalationRole } = req.body;

    const updated = await prisma.sLAConfig.upsert({
      where: { priority: String(priority).toUpperCase() },
      update: {
        responseTimeHours: Number(responseTimeHours),
        resolutionTimeHours: Number(resolutionTimeHours),
        escalationRole: escalationRole || 'ADMIN'
      },
      create: {
        priority: String(priority).toUpperCase(),
        responseTimeHours: Number(responseTimeHours),
        resolutionTimeHours: Number(resolutionTimeHours),
        escalationRole: escalationRole || 'ADMIN'
      }
    });

    // Create Audit Log
    if (req.user) {
      await prisma.auditLog.create({
        data: {
          actorId: req.user.id,
          actorName: req.user.name,
          action: 'UPDATE_SLA_POLICY',
          entity: 'SLAConfig',
          entityId: updated.id,
          details: JSON.stringify({ priority, responseTimeHours, resolutionTimeHours })
        }
      });
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('updateSLAPolicy error:', error);
    res.status(500).json({ success: false, error: 'Failed to update SLA policy' });
  }
}

export async function exportReportCSV(req: Request, res: Response): Promise<void> {
  try {
    const { type = 'tickets' } = req.query;

    if (type === 'agents') {
      const agents = await prisma.user.findMany({
        where: { role: { in: ['AGENT', 'ADMIN'] } },
        include: {
          assignedTickets: {
            select: { id: true, status: true, priority: true }
          }
        }
      });

      let csv = 'Agent ID,Name,Name (Arabic),Email,Role,Department,Status,Assigned Tickets,Open Tickets,Resolved Tickets\n';
      for (const a of agents) {
        const open = a.assignedTickets.filter((t) => ['NEW', 'OPEN', 'PENDING'].includes(t.status)).length;
        const resolved = a.assignedTickets.filter((t) => ['RESOLVED', 'CLOSED'].includes(t.status)).length;
        csv += `"${a.id}","${a.name}","${a.nameAr || ''}","${a.email}","${a.role}","${a.department}","${a.status}",${a.assignedTickets.length},${open},${resolved}\n`;
      }

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="azm_agents_report.csv"');
      res.send(csv);
      return;
    }

    // Default: Tickets Export
    const tickets = await prisma.ticket.findMany({
      include: {
        customer: true,
        assignedAgent: true
      },
      orderBy: { createdAt: 'desc' }
    });

    let csv = 'Ticket Number,Title,Status,Priority,Channel,Category,Department,Customer Name,Customer Email,Customer Company,Assigned Agent,SLA Status,Created At\n';
    for (const t of tickets) {
      const sla = computeSLAStatus(t);
      csv += `"${t.ticketNumber}","${t.title.replace(/"/g, '""')}","${t.status}","${t.priority}","${t.channel}","${t.category}","${t.department}","${t.customer?.name || ''}","${t.customer?.email || ''}","${t.customer?.company || ''}","${t.assignedAgent?.name || 'Unassigned'}","${sla}","${t.createdAt.toISOString()}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="azm_tickets_report.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('exportReportCSV error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
}


