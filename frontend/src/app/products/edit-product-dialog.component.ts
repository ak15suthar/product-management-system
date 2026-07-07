import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../shared/services/api.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Edit Product</h2>
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
        <div *ngIf="previewUrl" class="preview">
          <img [src]="previewUrl" alt="New preview" />
          <span>New image</span>
        </div>
        <div *ngIf="!previewUrl && existingImage" class="preview">
          <img [src]="existingImage" alt="Current image" />
          <span>Current image</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || !product.name || !product.price || !product.categoryId">
        {{ loading ? 'Updating...' : 'Update' }}
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
    .preview {
      margin-top: 0.5rem;
    }
    .preview img {
      max-width: 150px;
      max-height: 150px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    .preview span {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #999;
    }
  `],
})
export class EditProductDialogComponent {
  apiBaseUrl = '';
  product: { name: string; price: number; categoryId: string };
  existingImage?: string;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  categories: Category[];
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product; categories: Category[] }
  ) {
    this.product = {
      name: data.product.name,
      price: data.product.price,
      categoryId: data.product.category?.uuid || '',
    };
    this.existingImage = data.product.image || undefined;
    this.categories = data.categories;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => { this.previewUrl = reader.result as string; };
      reader.readAsDataURL(file);
    }
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

    this.apiService.updateProduct(this.data.product.id, formData).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Failed to update product');
      },
    });
  }
}
