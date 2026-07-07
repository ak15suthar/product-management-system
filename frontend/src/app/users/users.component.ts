import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
import { User } from '../models/user.model';
import { CreateUserDialogComponent } from './create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
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
    <div class="users-container">
      <div class="header">
        <h1>Users</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search by email or name" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-card>
        <div class="table-container" *ngIf="!loading; else loadingTemplate">
          <table mat-table [dataSource]="dataSource" class="users-table">
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">{{ user.name || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">
                <span class="role-badge" [class]="user.role">{{ user.role }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'medium' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="primary" (click)="openEditDialog(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(user)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="dataSource.data.length === 0" class="no-data">
            <mat-icon>people</mat-icon>
            <p>No users found</p>
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
    .users-container h1 {
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
    .users-table {
      width: 100%;
    }
    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    .role-badge.admin {
      background: #e3f2fd;
      color: #1976d2;
    }
    .role-badge.user {
      background: #e8f5e9;
      color: #388e3c;
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
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['email', 'name', 'role', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
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
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.apiService
      .getUsers({
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
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.email}?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete user', 'Close', { duration: 5000 });
      },
    });
  }
}
