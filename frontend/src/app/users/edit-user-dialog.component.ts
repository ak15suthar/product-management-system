import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../shared/services/api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput type="email" [(ngModel)]="user.email" required email />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput type="text" [(ngModel)]="user.name" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Role</mat-label>
        <mat-select [(ngModel)]="user.role">
          <mat-option value="user">User</mat-option>
          <mat-option value="admin">Admin</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || !user.email">
        {{ loading ? 'Updating...' : 'Update' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`],
})
export class EditUserDialogComponent {
  user: { email: string; name: string; role: string };
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { email: data.email, name: data.name || '', role: data.role };
  }

  onSubmit(): void {
    this.loading = true;
    this.apiService.updateUser(this.data.id, this.user).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Failed to update user');
      },
    });
  }
}
