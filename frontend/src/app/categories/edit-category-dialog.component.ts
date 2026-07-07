import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../shared/services/api.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit Category</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Category Name</mat-label>
        <input matInput type="text" [(ngModel)]="name" required />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || !name">
        {{ loading ? 'Updating...' : 'Update' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`],
})
export class EditCategoryDialogComponent {
  name: string;
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.name = data.name;
  }

  onSubmit(): void {
    this.loading = true;
    this.apiService.updateCategory(this.data.id, { name: this.name }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Failed to update category');
      },
    });
  }
}
