const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL ?? 'http://localhost:4000') + '/api'
    : (process.env.NEXT_PUBLIC_API_URL ?? '/api');

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const json = (await response.json()) as ApiSuccess<T> | { success: false; message: string };
  if (!response.ok || !json.success) {
    throw new Error('success' in json && !json.success ? json.message : 'Request failed');
  }
  return json.data;
}

export async function apiSend<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await response.json()) as ApiSuccess<T> | { success: false; message: string };
  if (!response.ok || !json.success) {
    throw new Error('success' in json && !json.success ? json.message : 'Request failed');
  }
  return json.data;
}

export async function apiList<T>(path: string): Promise<{ data: T; meta?: PaginationMeta }> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    next: { revalidate: 30 },
  });
  const json = (await response.json()) as ApiSuccess<T> | { success: false; message: string };
  if (!response.ok || !json.success) {
    return { data: [] as T };
  }
  return { data: json.data, meta: json.meta };
}
