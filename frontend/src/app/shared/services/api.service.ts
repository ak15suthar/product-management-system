import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductListParams,
  BulkUploadResult,
  DashboardStats,
} from '../../models/product.model';
import { User } from '../../models/user.model';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    return httpParams;
  }

  getDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.API_URL}/dashboard`);
  }

  getUsers(params: { page?: number; limit?: number; search?: string } = {}): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.API_URL}/users`, {
      params: this.buildParams(params),
    });
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/users/${id}`);
  }

  createUser(data: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API_URL}/users`, data);
  }

  updateUser(id: number, data: any): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/users/${id}`);
  }

  getCategories(params: { page?: number; limit?: number; search?: string } = {}): Observable<PaginatedResponse<Category>> {
    return this.http.get<PaginatedResponse<Category>>(`${this.API_URL}/categories`, {
      params: this.buildParams(params),
    });
  }

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.API_URL}/categories/all`);
  }

  getCategory(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.API_URL}/categories/${id}`);
  }

  createCategory(data: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.API_URL}/categories`, data);
  }

  updateCategory(id: number, data: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.API_URL}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/categories/${id}`);
  }

  getProducts(params: ProductListParams): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(`${this.API_URL}/products`, {
      params: this.buildParams(params as Record<string, any>),
    });
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.API_URL}/products/${id}`);
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.API_URL}/products`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.API_URL}/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/products/${id}`);
  }

  bulkUpload(file: File): Observable<ApiResponse<BulkUploadResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<BulkUploadResult>>(`${this.API_URL}/products/bulk-upload`, formData);
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/products/export/csv`, {
      responseType: 'blob',
    });
  }

  exportXlsx(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/products/export/xlsx`, {
      responseType: 'blob',
    });
  }
}
