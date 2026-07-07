import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
          <mat-card-subtitle>Create a new account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput type="text" name="name" [(ngModel)]="name" required />
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" name="email" [(ngModel)]="email" required email />
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                name="password"
                [(ngModel)]="password"
                required
                minlength="6"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="loading || registerForm.invalid"
            >
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Register</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="text-center">
            Already have an account?
            <a routerLink="/login">Login</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .register-card {
      max-width: 400px;
      width: 100%;
      margin: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .submit-btn {
      height: 48px;
      margin-top: 1rem;
    }
    .text-center {
      text-align: center;
    }
    mat-card-content {
      padding-top: 1rem;
    }
  `],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  hidePassword = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 5000 });
      },
    });
  }
}
