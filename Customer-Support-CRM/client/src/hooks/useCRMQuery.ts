'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Customer,
  Ticket,
  KnowledgeArticle,
  AnalyticsResponse,
  AuditLog,
  SLAConfig
} from '@/lib/openapi-types';

/**
 * Type-safe React Query hooks wrapping the OpenAPI 3.0 Contract for AZM CRM
 */

// 1. Customers Hooks
export function useCustomers(params?: {
  search?: string;
  tier?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const res = await api.getCustomers(params);
      return res.data as Customer[];
    }
  });
}

export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.getCustomerById(id);
      return res.data as Customer;
    },
    enabled: !!id
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => api.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

// 2. Omnichannel Tickets Hooks
export function useTickets(params?: {
  search?: string;
  status?: string;
  priority?: string;
  channel?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const res = await api.getTickets(params);
      return res.data as Ticket[];
    }
  });
}

export function useTicket(id: string | null) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.getTicketById(id);
      return res.data as Ticket;
    },
    enabled: !!id
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, actorName }: { id: string; status: string; actorName?: string }) =>
      api.updateTicketStatus(id, status, actorName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
}

export function useAddTicketNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      data
    }: {
      ticketId: string;
      data: { content: string; authorName?: string; isInternal?: boolean; channel?: string };
    }) => api.addTicketNote(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    }
  });
}

export function useSubmitCSAT() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      data
    }: {
      ticketId: string;
      data: { rating: number; feedback?: string };
    }) => api.submitCSAT(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
}

// 3. Knowledge Base Hooks
export function useKnowledgeBase(params?: { search?: string; category?: string }) {
  return useQuery({
    queryKey: ['kb-articles', params],
    queryFn: async () => {
      const res = await api.getKnowledgeArticles(params);
      return res.data as KnowledgeArticle[];
    }
  });
}

export function useVoteKnowledgeArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, isHelpful }: { slug: string; isHelpful: boolean }) =>
      api.voteKnowledgeArticle(slug, isHelpful),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb-articles'] });
    }
  });
}

// 4. Executive Analytics & Audit Logs Hooks
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.getAnalytics();
      return res.data as AnalyticsResponse;
    }
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await api.getAuditLogs();
      return res.data as AuditLog[];
    }
  });
}

export function useSLAPolicies() {
  return useQuery({
    queryKey: ['sla-policies'],
    queryFn: async () => {
      const res = await api.getSLAPolicies();
      return res.data as SLAConfig[];
    }
  });
}
