import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../shared/services/api.service';
import { DashboardStats } from '../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon users">people</mat-icon>
            <div class="stat-info">
              <h2>{{ stats?.totalUsers || 0 }}</h2>
              <p>Total Users</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon categories">category</mat-icon>
            <div class="stat-info">
              <h2>{{ stats?.totalCategories || 0 }}</h2>
              <p>Total Categories</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon class="stat-icon products">inventory_2</mat-icon>
            <div class="stat-info">
              <h2>{{ stats?.totalProducts || 0 }}</h2>
              <p>Total Products</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" routerLink="/products" routerLinkActive="active">
                <mat-icon>add</mat-icon>
                Add Product
              </button>
              <button mat-raised-button color="accent" routerLink="/categories">
                <mat-icon>add</mat-icon>
                Add Category
              </button>
              <button mat-raised-button color="warn" routerLink="/bulk-upload">
                <mat-icon>upload_file</mat-icon>
                Bulk Upload
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Products</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list *ngIf="stats?.recentProducts?.length; else noProducts">
              <mat-list-item *ngFor="let product of stats?.recentProducts">
                <mat-icon matListItemIcon>inventory_2</mat-icon>
                <span matListItemTitle>{{ product.name }}</span>
                <span matListItemLine>{{ product.category?.name }} - \${{ product.price }}</span>
              </mat-list-item>
            </mat-list>
            <ng-template #noProducts>
              <p class="no-data">No recent products</p>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }
    .stat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-right: 1rem;
    }
    .stat-icon.users { color: #2196f3; }
    .stat-icon.categories { color: #ff9800; }
    .stat-icon.products { color: #4caf50; }
    .stat-info h2 {
      margin: 0;
      font-size: 2rem;
    }
    .stat-info p {
      margin: 0;
      color: #666;
    }
    .quick-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem 0;
    }
    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .recent-section {
      margin-top: 1.5rem;
    }
    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.apiService.getDashboard().subscribe({
      next: (response) => {
        this.stats = response.data || null;
      },
    });
  }
}
