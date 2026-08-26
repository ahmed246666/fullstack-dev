import { prisma } from '../db';

export interface SLADeadlines {
  responseDueAt: Date;
  resolutionDueAt: Date;
}

export type SLAStatusType = 'ON_TRACK' | 'APPROACHING_BREACH' | 'BREACHED' | 'RESOLVED_ON_TIME' | 'RESOLVED_LATE';

export async function calculateSLADeadlines(priority: string): Promise<SLADeadlines> {
  const config = await prisma.sLAConfig.findUnique({
    where: { priority: priority.toUpperCase() }
  });

  const now = new Date();
  const responseHours = config?.responseTimeHours ?? (priority === 'URGENT' ? 1 : priority === 'HIGH' ? 2 : priority === 'MEDIUM' ? 4 : 8);
  const resolutionHours = config?.resolutionTimeHours ?? (priority === 'URGENT' ? 4 : priority === 'HIGH' ? 8 : priority === 'MEDIUM' ? 24 : 48);

  const responseDueAt = new Date(now.getTime() + responseHours * 3600 * 1000);
  const resolutionDueAt = new Date(now.getTime() + resolutionHours * 3600 * 1000);

  return { responseDueAt, resolutionDueAt };
}

export function computeSLAStatus(ticket: {
  status: string;
  resolutionDueAt?: Date | null;
  resolvedAt?: Date | null;
}): SLAStatusType {
  const now = new Date();

  if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
    if (ticket.resolvedAt && ticket.resolutionDueAt && ticket.resolvedAt > ticket.resolutionDueAt) {
      return 'RESOLVED_LATE';
    }
    return 'RESOLVED_ON_TIME';
  }

  if (!ticket.resolutionDueAt) {
    return 'ON_TRACK';
  }

  const dueDate = new Date(ticket.resolutionDueAt);
  const diffMs = dueDate.getTime() - now.getTime();

  if (diffMs < 0) {
    return 'BREACHED';
  }

  // If less than 2 hours remaining
  if (diffMs < 2 * 3600 * 1000) {
    return 'APPROACHING_BREACH';
  }

  return 'ON_TRACK';
}
