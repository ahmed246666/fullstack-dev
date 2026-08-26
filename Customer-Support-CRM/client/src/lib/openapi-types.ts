/**
 * Auto-generated OpenAPI 3.0 TypeScript definitions for AZM Customer Support CRM.
 * Synchronized with server/src/openapi/openapi.json
 */

export interface Components {
  schemas: {
    Customer: {
      id: string;
      name: string;
      nameAr: string | null;
      email: string;
      phone: string | null;
      company: string | null;
      tier: 'STANDARD' | 'VIP' | 'ENTERPRISE';
      createdAt: string;
      updatedAt: string;
      tickets?: Components['schemas']['Ticket'][];
      notes?: Components['schemas']['Note'][];
    };

    Ticket: {
      id: string;
      ticketNumber: string;
      title: string;
      description: string;
      status: 'NEW' | 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      channel: 'EMAIL' | 'WHATSAPP' | 'LIVE_CHAT' | 'SMS' | 'WEB_FORM';
      department: string;
      slaStatus:
        'ON_TRACK' | 'APPROACHING_BREACH' | 'BREACHED' | 'RESOLVED_ON_TIME' | 'RESOLVED_LATE';
      responseDueAt: string | null;
      resolutionDueAt: string | null;
      firstResponseAt: string | null;
      resolvedAt: string | null;
      csatRating: number | null;
      csatFeedback: string | null;
      customerId: string;
      assignedAgentId: string | null;
      createdAt: string;
      updatedAt: string;
      customer?: Components['schemas']['Customer'];
      assignedAgent?: Components['schemas']['User'];
      notes?: Components['schemas']['Note'][];
    };

    Note: {
      id: string;
      content: string;
      authorName: string;
      isInternal: boolean;
      channel: string;
      ticketId: string;
      createdAt: string;
    };

    KnowledgeArticle: {
      id: string;
      title: string;
      titleAr: string;
      slug: string;
      category: string;
      tags: string;
      content: string;
      contentAr: string;
      helpfulCount: number;
      notHelpfulCount: number;
      createdAt: string;
      updatedAt: string;
    };

    SLAConfig: {
      id: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      responseTimeHours: number;
      resolutionTimeHours: number;
      updatedAt: string;
    };

    User: {
      id: string;
      name: string;
      nameAr: string;
      email: string;
      role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
      department: string;
      avatarUrl: string;
    };

    AnalyticsResponse: {
      totalTickets: number;
      openTickets: number;
      resolvedTickets: number;
      avgResolutionTimeHours: string;
      slaComplianceRate: number;
      csatScore: number;
      slaBreakdown: {
        onTrack: number;
        approachingBreach: number;
        breached: number;
      };
      channelBreakdown: {
        WHATSAPP: number;
        EMAIL: number;
        LIVE_CHAT: number;
        SMS: number;
        WEB_FORM: number;
      };
    };

    AuditLog: {
      id: string;
      action: string;
      entityType: string;
      entityId: string | null;
      actorId: string | null;
      metadata: any;
      createdAt: string;
      actor?: Components['schemas']['User'];
    };
  };
}

export type Customer = Components['schemas']['Customer'];
export type Ticket = Components['schemas']['Ticket'];
export type Note = Components['schemas']['Note'];
export type KnowledgeArticle = Components['schemas']['KnowledgeArticle'];
export type SLAConfig = Components['schemas']['SLAConfig'];
export type User = Components['schemas']['User'];
export type AnalyticsResponse = Components['schemas']['AnalyticsResponse'];
export type AuditLog = Components['schemas']['AuditLog'];
