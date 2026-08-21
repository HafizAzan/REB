import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiSuccess, PaginationMeta } from '@/types/api';

const API_URL =
  typeof window === 'undefined'
    ? `${process.env.API_INTERNAL_URL ?? 'http://localhost:4000'}/api`
    : (process.env.NEXT_PUBLIC_API_URL ?? '/api');

export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code = 'REQUEST_FAILED', status = 400) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

function toApiError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) return error;
  if (error instanceof AxiosError) {
    const payload = error.response?.data as { message?: string; code?: string } | undefined;
    return new ApiRequestError(
      payload?.message ?? error.message ?? 'Request failed',
      payload?.code ?? 'REQUEST_FAILED',
      error.response?.status ?? 400,
    );
  }
  return new ApiRequestError(error instanceof Error ? error.message : 'Request failed');
}

function unwrap<T>(payload: ApiSuccess<T> | { success: false; message: string; code?: string }, status: number): T {
  if (!payload || !('success' in payload) || !payload.success) {
    throw new ApiRequestError(
      payload && 'message' in payload ? payload.message : 'Request failed',
      payload && 'code' in payload && typeof payload.code === 'string' ? payload.code : 'REQUEST_FAILED',
      status,
    );
  }
  return payload.data;
}

export async function apiGet<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await http.get<ApiSuccess<T>>(path, config);
    return unwrap(response.data, response.status);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiSend<T>(path: string, method: string, body?: unknown): Promise<T> {
  try {
    const response = await http.request<ApiSuccess<T>>({
      url: path,
      method,
      data: body,
    });
    return unwrap(response.data, response.status);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const body = new FormData();
  body.append('file', file);
  try {
    const response = await axios.post<ApiSuccess<T>>(path, body, {
      baseURL: API_URL,
      withCredentials: true,
      timeout: 120_000,
    });
    return unwrap(response.data, response.status);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiList<T>(path: string): Promise<{ data: T; meta?: PaginationMeta }> {
  try {
    const response = await http.get<ApiSuccess<T>>(path);
    if (!response.data?.success) {
      return { data: [] as T };
    }
    return { data: response.data.data, meta: response.data.meta };
  } catch {
    return { data: [] as T };
  }
}
