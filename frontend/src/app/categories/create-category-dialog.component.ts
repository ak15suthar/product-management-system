import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Create Category</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Category Name</mat-label>
        <input matInput type="text" [(ngModel)]="name" required />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || !name">
        {{ loading ? 'Creating...' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`],
})
export class CreateCategoryDialogComponent {
  name = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.apiService.createCategory({ name: this.name }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Failed to create category');
      },
    });
  }
}
