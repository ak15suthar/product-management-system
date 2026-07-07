import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../shared/services/api.service';
import { Category } from '../models/category.model';
import { CreateCategoryDialogComponent } from './create-category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category-dialog.component';

@Component({
  selector: 'app-categories',
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
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  template: `
    <div class="categories-container">
      <div class="header">
        <h1>Categories</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </div>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search categories</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search by name" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-card>
        <div class="table-container" *ngIf="!loading; else loadingTemplate">
          <table mat-table [dataSource]="dataSource" class="categories-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let category">{{ category.name }}</td>
            </ng-container>

            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Products</th>
              <td mat-cell *matCellDef="let category">{{ category._count?.products || 0 }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let category">{{ category.createdAt | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let category">
                <button mat-icon-button color="primary" (click)="openEditDialog(category)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(category)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="dataSource.data.length === 0" class="no-data">
            <mat-icon>category</mat-icon>
            <p>No categories found</p>
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
          [pageSizeOptions]="[5, 10, 25]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .categories-container h1 {
      margin-bottom: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .search-bar {
      margin-bottom: 1rem;
    }
    .search-field {
      width: 100%;
      max-width: 400px;
    }
    .table-container {
      overflow-x: auto;
    }
    .categories-table {
      width: 100%;
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
export class CategoriesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'products', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.apiService
      .getCategories({
        page: this.currentPage + 1,
        limit: this.pageSize,
        search: this.searchTerm,
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
    this.loadCategories();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
        this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '400px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
        this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  confirmDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete "${category.name}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategory(category.id);
      }
    });
  }

  deleteCategory(id: number): void {
    this.apiService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete category', 'Close', { duration: 5000 });
      },
    });
  }
}
