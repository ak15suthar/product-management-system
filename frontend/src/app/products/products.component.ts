import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../shared/services/api.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';
import { CreateProductDialogComponent } from './create-product-dialog.component';
import { EditProductDialogComponent } from './edit-product-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
  ],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>Products</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search products</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search by name" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="category-filter">
          <mat-label>Filter by Category</mat-label>
          <mat-select [(ngModel)]="selectedCategoryId" (selectionChange)="onFilterChange()">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category.uuid">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="sort-field">
          <mat-label>Sort By</mat-label>
          <mat-select [(ngModel)]="sortBy" (selectionChange)="onSortChange()">
            <mat-option value="createdAt">Date Created</mat-option>
            <mat-option value="name">Name</mat-option>
            <mat-option value="price">Price</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-icon-button (click)="toggleSortOrder()" [matTooltip]="sortOrder === 'asc' ? 'Ascending' : 'Descending'">
          <mat-icon>{{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
        </button>
      </div>

      <mat-card>
        <div class="table-container" *ngIf="!loading; else loadingTemplate">
          <table mat-table [dataSource]="dataSource" class="products-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let product">{{ product.category?.name }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">\${{ product.price }}</td>
            </ng-container>

            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let product">
                <img
                  *ngIf="product.image"
                  [src]="apiBaseUrl + product.image"
                  class="product-image"
                  alt="Product"
                />
                <span *ngIf="!product.image" class="no-image">No image</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let product">{{ product.createdAt | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <button mat-icon-button color="primary" (click)="openEditDialog(product)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(product)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="dataSource.data.length === 0" class="no-data">
            <mat-icon>inventory_2</mat-icon>
            <p>No products found</p>
          </div>
        </div>

        <ng-template #loadingTemplate>
          <div class="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        </ng-template>

        <mat-paginator
          [length]="totalRecords"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .products-container h1 {
      margin-bottom: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .search-field, .category-filter, .sort-field {
      flex: 1;
      min-width: 200px;
    }
    .table-container {
      overflow-x: auto;
    }
    .products-table {
      width: 100%;
    }
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    .no-image {
      color: #999;
      font-size: 0.875rem;
    }
    .no-data {
      text-align: center;
      padding: 3rem;
      color: #999;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }
  `],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  apiBaseUrl = environment.apiUrl.replace('/api', '');
  displayedColumns = ['name', 'category', 'price', 'image', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  categories: Category[] = [];
  totalRecords = 0;
  pageSize = 20;
  currentPage = 0;
  searchTerm = '';
  selectedCategoryId = '';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
      },
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService
      .getProducts({
        page: this.currentPage + 1,
        limit: this.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        search: this.searchTerm,
        categoryId: this.selectedCategoryId,
      })
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data || [];
          this.totalRecords = response.pagination?.totalRecords || 0;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      width: '500px',
      data: { categories: this.categories },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '500px',
      data: { product, categories: this.categories },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  confirmDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(product.id);
      }
    });
  }

  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete product', 'Close', { duration: 5000 });
      },
    });
  }
}
