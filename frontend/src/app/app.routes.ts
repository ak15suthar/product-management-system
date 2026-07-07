import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories.component').then((m) => m.CategoriesComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'bulk-upload',
        loadComponent: () => import('./bulk-upload/bulk-upload.component').then((m) => m.BulkUploadComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then((m) => m.ReportsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
