export type ItemStatus = 'pending' | 'in-progress' | 'completed';

export interface Item {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  createdAt: string;
}

export interface StatusCounts {
  all: number;
  pending: number;
  'in-progress': number;
  completed: number;
}

export interface CreateItemPayload {
  title: string;
  description?: string;
  status?: ItemStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  counts?: StatusCounts;
  message?: string;
  errors?: string[];
}

export interface BackendHealth {
  status: string;
  timestamp: string;
}
