const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API Request failed with status ${res.status}`);
  }

  return res.json();
}

// Typed API Functions
export const api = {
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
    data: { content: string; authorName?: string; isInternal?: boolean; channel?: string }
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

  // Agents & Canned Responses
  getAgents: () => fetchApi<{ success: boolean; data: any[] }>('/users/agents'),
  getCannedResponses: () => fetchApi<{ success: boolean; data: any[] }>('/users/canned-responses')
};
