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
    const [totalTickets, openTickets, resolvedTickets, customersCount, tickets, csatAgg] = await Promise.all([
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

    const slaComplianceRate = totalTickets > 0 ? Math.round((onTrackCount / totalTickets) * 100) : 100;

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
