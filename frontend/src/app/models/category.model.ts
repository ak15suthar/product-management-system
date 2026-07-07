export interface Category {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}
