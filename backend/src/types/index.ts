import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    uuid: string;
    email: string;
    role: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface BulkUploadResult {
  inserted: number;
  failed: number;
  errors: Array<{ row: number; message: string; data?: Record<string, unknown> }>;
}

export interface JwtPayload {
  id: number;
  uuid: string;
  email: string;
  role: string;
}
