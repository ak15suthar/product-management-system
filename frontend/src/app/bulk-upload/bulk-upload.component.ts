import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../shared/services/api.service';
import { BulkUploadResult } from '../models/product.model';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="bulk-upload-container">
      <h1>Bulk Upload</h1>

      <mat-card class="upload-card">
        <mat-card-header>
          <mat-card-title>Upload CSV File</mat-card-title>
          <mat-card-subtitle>Upload a CSV file with products (name, price, category)</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="upload-area" (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
            <input
              #fileInput
              type="file"
              accept=".csv"
              (change)="onFileSelected($event)"
              hidden
            />
            <mat-icon *ngIf="!selectedFile">cloud_upload</mat-icon>
            <mat-icon *ngIf="selectedFile" class="file-icon">description</mat-icon>
            <p *ngIf="!selectedFile">Click or drag CSV file here</p>
            <p *ngIf="selectedFile">{{ selectedFile.name }}</p>
          </div>

          <div class="upload-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="uploadFile()"
              [disabled]="!selectedFile || uploading"
            >
              <mat-spinner *ngIf="uploading" diameter="20"></mat-spinner>
              <span *ngIf="!uploading">Upload</span>
            </button>
            <button mat-button (click)="clearFile()" [disabled]="uploading">Clear</button>
          </div>

          <mat-progress-bar
            *ngIf="uploading"
            mode="indeterminate"
            class="upload-progress"
          ></mat-progress-bar>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="uploadResult" class="result-card">
        <mat-card-header>
          <mat-card-title>Upload Results</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="result-stats">
            <div class="stat success">
              <mat-icon>check_circle</mat-icon>
              <span>{{ uploadResult.inserted }} inserted</span>
            </div>
            <div class="stat error">
              <mat-icon>error</mat-icon>
              <span>{{ uploadResult.failed }} failed</span>
            </div>
          </div>

          <div *ngIf="uploadResult.errors.length" class="errors-section">
            <h3>Errors</h3>
            <table mat-table [dataSource]="uploadResult.errors" class="errors-table">
              <ng-container matColumnDef="row">
                <th mat-header-cell *matHeaderCellDef>Row</th>
                <td mat-cell *matCellDef="let error">{{ error.row }}</td>
              </ng-container>

              <ng-container matColumnDef="message">
                <th mat-header-cell *matHeaderCellDef>Error</th>
                <td mat-cell *matCellDef="let error">{{ error.message }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="errorColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: errorColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .bulk-upload-container h1 {
      margin-bottom: 1rem;
    }
    .upload-card {
      margin-bottom: 1.5rem;
    }
    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.3s;
      margin-bottom: 1rem;
    }
    .upload-area:hover {
      border-color: #3f51b5;
    }
    .upload-area mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #999;
    }
    .upload-area .file-icon {
      color: #3f51b5;
    }
    .upload-actions {
      display: flex;
      gap: 1rem;
    }
    .upload-progress {
      margin-top: 1rem;
    }
    .result-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
    }
    .stat.success {
      color: #4caf50;
    }
    .stat.error {
      color: #f44336;
    }
    .errors-section h3 {
      margin-bottom: 1rem;
      color: #f44336;
    }
    .errors-table {
      width: 100%;
    }
  `],
})
export class BulkUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadResult: BulkUploadResult | null = null;
  errorColumns = ['row', 'message'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Please select a CSV file', 'Close', { duration: 3000 });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Please select a CSV file', 'Close', { duration: 3000 });
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadResult = null;

    this.apiService.bulkUpload(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadResult = response.data || null;
        this.uploading = false;
        this.snackBar.open('Upload completed', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.uploading = false;
        this.snackBar.open(err.error?.message || 'Upload failed', 'Close', { duration: 5000 });
      },
    });
  }

  clearFile(): void {
    this.selectedFile = null;
    this.uploadResult = null;
  }
}
