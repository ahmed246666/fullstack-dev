import { Item, CreateItemPayload, ApiResponse, BackendHealth, ItemStatus, StatusCounts } from '../types/item';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BACKEND_ROOT_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * Check backend connection status and health
 */
export async function checkBackendHealth(): Promise<BackendHealth | null> {
  try {
    const res = await fetch(`${BACKEND_ROOT_URL}/health`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface FetchItemsResult {
  items: Item[];
  counts: StatusCounts;
}

/**
 * Fetch items with backend-side search and status tab filtering
 */
export async function fetchItems(params?: { search?: string; status?: string }): Promise<FetchItemsResult> {
  const query = new URLSearchParams();
  if (params?.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params?.status && params.status !== 'all') {
    query.set('status', params.status);
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/items${queryString}`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    const errorBody: ApiResponse<never> = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch items (${res.status})`);
  }

  const result: ApiResponse<Item[]> = await res.json();
  return {
    items: result.data || [],
    counts: result.counts || { all: 0, pending: 0, 'in-progress': 0, completed: 0 }
  };
}

/**
 * Fetch a single item by id
 */
export async function fetchItemById(id: number | string): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    const errorBody: ApiResponse<never> = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch item ${id}`);
  }

  const result: ApiResponse<Item> = await res.json();
  if (!result.data) {
    throw new Error(`Item ${id} not found`);
  }
  return result.data;
}

/**
 * Create a new item
 */
export async function createItem(payload: CreateItemPayload): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body: ApiResponse<Item> = await res.json().catch(() => ({
    success: false,
    message: 'Unknown response format'
  }));

  if (!res.ok || !body.success) {
    const errorMsg = body.errors?.length
      ? body.errors.join('. ')
      : (body.message || `Failed to create item (${res.status})`);
    throw new Error(errorMsg);
  }

  return body.data!;
}

/**
 * Update an item's status (used by Kanban drag-and-drop)
 */
export async function updateItemStatus(id: number | string, status: ItemStatus): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  const body: ApiResponse<Item> = await res.json().catch(() => ({
    success: false,
    message: 'Unknown response format'
  }));

  if (!res.ok || !body.success) {
    throw new Error(body.message || `Failed to update status (${res.status})`);
  }

  return body.data!;
}

/**
 * Delete an item by id
 */
export async function deleteItem(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    const errorBody: ApiResponse<never> = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to delete item ${id}`);
  }
}
