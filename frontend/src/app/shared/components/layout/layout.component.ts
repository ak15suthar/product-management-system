import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <h2>PMS</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/users" routerLinkActive="active-link">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Users</span>
          </a>
          <a mat-list-item routerLink="/categories" routerLinkActive="active-link">
            <mat-icon matListItemIcon>category</mat-icon>
            <span matListItemTitle>Categories</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active-link">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Products</span>
          </a>
          <a mat-list-item routerLink="/bulk-upload" routerLinkActive="active-link">
            <mat-icon matListItemIcon>upload_file</mat-icon>
            <span matListItemTitle>Bulk Upload</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active-link">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Reports</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Product Management System</span>
          <span class="spacer"></span>
          <span class="user-email">{{ authService.user()?.email }}</span>
          <button mat-icon-button (click)="authService.logout()" matTooltip="Logout">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
    }
    .sidenav {
      width: 240px;
      background: #f5f5f5;
    }
    .sidenav-header {
      padding: 1.5rem;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
    }
    .sidenav-header h2 {
      margin: 0;
      color: #3f51b5;
    }
    .active-link {
      background: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .toolbar-title {
      margin-left: 0.5rem;
    }
    .spacer {
      flex: 1;
    }
    .user-email {
      margin-right: 1rem;
      font-size: 0.875rem;
    }
    .main-content {
      padding: 1.5rem;
      min-height: calc(100vh - 64px);
      background: #fafafa;
    }
  `],
})
export class LayoutComponent {
  constructor(public authService: AuthService) {}
}
