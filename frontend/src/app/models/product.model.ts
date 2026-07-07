export interface Product {
  id: number;
  uuid: string;
  name: string;
  image?: string;
  price: number;
  categoryId: number;
  category?: {
    id: number;
    uuid: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: string;
  image?: File;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  categoryId?: string;
  image?: File;
}

export interface ProductListParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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

export interface ApiResponse<T> {
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

export interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalProducts: number;
  recentProducts: Product[];
}
