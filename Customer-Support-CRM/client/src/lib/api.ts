const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('azm_auth_token');
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('azm_auth_token', token);
    } else {
      localStorage.removeItem('azm_auth_token');
    }
  }
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API Request failed with status ${res.status}`);
  }

  return res.json();
}

// Typed API Functions
export const api = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    fetchApi<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => fetchApi<{ success: boolean; user: any }>('/auth/me'),

  register: (data: {
    name: string;
    nameAr?: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
  }) =>
    fetchApi<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Analytics
  getAnalytics: () => fetchApi<{ success: boolean; data: any }>('/users/analytics'),


  // Customers
  getCustomers: (params?: { search?: string; tier?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tier && params.tier !== 'ALL') searchParams.set('tier', params.tier);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    return fetchApi<{ success: boolean; data: any[]; pagination: any }>(
      `/customers?${searchParams.toString()}`
    );
  },

  getCustomerById: (id: string) => fetchApi<{ success: boolean; data: any }>(`/customers/${id}`),

  createCustomer: (data: any) =>
    fetchApi<{ success: boolean; data: any }>('/customers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Tickets
  getTickets: (params?: {
    search?: string;
    status?: string;
    priority?: string;
    channel?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status && params.status !== 'ALL') searchParams.set('status', params.status);
    if (params?.priority && params.priority !== 'ALL')
      searchParams.set('priority', params.priority);
    if (params?.channel && params.channel !== 'ALL') searchParams.set('channel', params.channel);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    return fetchApi<{ success: boolean; data: any[]; pagination: any }>(
      `/tickets?${searchParams.toString()}`
    );
  },

  getTicketById: (id: string) => fetchApi<{ success: boolean; data: any }>(`/tickets/${id}`),

  createTicket: (data: any) =>
    fetchApi<{ success: boolean; data: any }>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateTicketStatus: (id: string, status: string, actorName?: string) =>
    fetchApi<{ success: boolean; data: any }>(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, actorName })
    }),

  addTicketNote: (
    ticketId: string,
    data: {
      content: string;
      authorName?: string;
      isInternal?: boolean;
      channel?: string;
      attachments?: any[];
    }
  ) =>
    fetchApi<{ success: boolean; data: any }>(`/tickets/${ticketId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),


  // Knowledge Base
  getKnowledgeArticles: (params?: { search?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category && params.category !== 'ALL')
      searchParams.set('category', params.category);
    return fetchApi<{ success: boolean; data: any[] }>(
      `/knowledge-base?${searchParams.toString()}`
    );
  },

  getKnowledgeArticleBySlug: (slug: string) =>
    fetchApi<{ success: boolean; data: any }>(`/knowledge-base/${slug}`),

  createKnowledgeArticle: (data: any) =>
    fetchApi<{ success: boolean; data: any }>('/knowledge-base', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateKnowledgeArticle: (id: string, data: any) =>
    fetchApi<{ success: boolean; data: any }>(`/knowledge-base/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteKnowledgeArticle: (id: string) =>
    fetchApi<{ success: boolean; message: string }>(`/knowledge-base/${id}`, {
      method: 'DELETE'
    }),

  voteKnowledgeArticle: (slug: string, isHelpful: boolean) =>
    fetchApi<{ success: boolean; data: any }>(`/knowledge-base/${slug}/vote`, {
      method: 'POST',
      body: JSON.stringify({ isHelpful })
    }),

  // File Upload Pipeline
  uploadFile: async (file: File) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload file');
    }

    return res.json() as Promise<{
      success: boolean;
      data: {
        filename: string;
        originalName: string;
        fileUrl: string;
        mimeType: string;
        sizeBytes: number;
      };
    }>;
  },


  // Agents & Canned Responses
  getAgents: () => fetchApi<{ success: boolean; data: any[] }>('/users/agents'),
  getCannedResponses: () => fetchApi<{ success: boolean; data: any[] }>('/users/canned-responses'),

  // SLA & CSAT
  submitCSAT: (ticketId: string, data: { rating: number; feedback?: string }) =>
    fetchApi<{ success: boolean; data: any }>(`/tickets/${ticketId}/csat`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getSLAPolicies: () => fetchApi<{ success: boolean; data: any[] }>('/users/sla-policies'),

  updateSLAPolicy: (
    priority: string,
    data: { responseTimeHours: number; resolutionTimeHours: number }
  ) =>
    fetchApi<{ success: boolean; data: any }>(`/users/sla-policies/${priority}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Audit Logs
  getAuditLogs: () => fetchApi<{ success: boolean; data: any[] }>('/users/audit-logs'),

  // AI Chatbot
  chatWithPortalBot: (data: {
    message: string;
    history?: Array<{ role: 'user' | 'model'; text: string }>;
    customerName?: string;
  }) =>
    fetchApi<{
      success: boolean;
      data: {
        reply: string;
        suggestedArticles: Array<{ id: string; title: string; titleAr?: string | null; slug: string }>;
        escalateToTicket: boolean;
        confidenceScore: number;
      };
    }>('/ai/chatbot', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // SLA Automation
  escalateOverdueTickets: () =>
    fetchApi<{
      success: boolean;
      message: string;
      data: { escalatedCount: number; ticketNumbers: string[] };
    }>('/tickets/escalate-overdue', {
      method: 'POST'
    }),

  // CSV Report Export URL
  getExportReportUrl: (type: 'tickets' | 'agents' = 'tickets') =>
    `${API_BASE_URL}/users/export-report?type=${type}`
};

