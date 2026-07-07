import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../shared/services/api.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-create-product-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Create Product</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Product Name</mat-label>
        <input matInput type="text" [(ngModel)]="product.name" required />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Price</mat-label>
        <input matInput type="number" [(ngModel)]="product.price" required min="0.01" step="0.01" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="product.categoryId" required>
          <mat-option *ngFor="let category of categories" [value]="category.uuid">
            {{ category.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div class="file-upload">
        <label>Product Image (optional)</label>
        <input type="file" (change)="onFileSelected($event)" accept="image/*" />
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || !product.name || !product.price || !product.categoryId">
        {{ loading ? 'Creating...' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .file-upload {
      margin-top: 1rem;
    }
    .file-upload label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
  `],
})
export class CreateProductDialogComponent {
  product = { name: '', price: 0, categoryId: '' };
  selectedFile: File | null = null;
  categories: Category[];
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CreateProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) {
    this.categories = data.categories;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('categoryId', this.product.categoryId);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.apiService.createProduct(formData).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Failed to create product');
      },
    });
  }
}
