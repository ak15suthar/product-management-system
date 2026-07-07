import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="reports-container">
      <h1>Reports</h1>

      <div class="reports-grid">
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>CSV Export</mat-card-title>
            <mat-card-subtitle>Download products as CSV file</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-icon class="report-icon csv">description</mat-icon>
            <p>Export all products with their categories and prices in CSV format.</p>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              (click)="exportCsv()"
              [disabled]="exportingCsv"
            >
              <mat-spinner *ngIf="exportingCsv" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!exportingCsv">download</mat-icon>
              <span *ngIf="!exportingCsv">Download CSV</span>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>XLSX Export</mat-card-title>
            <mat-card-subtitle>Download products as Excel file</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-icon class="report-icon xlsx">table_chart</mat-icon>
            <p>Export all products with their categories and prices in Excel format.</p>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="accent"
              (click)="exportXlsx()"
              [disabled]="exportingXlsx"
            >
              <mat-spinner *ngIf="exportingXlsx" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!exportingXlsx">download</mat-icon>
              <span *ngIf="!exportingXlsx">Download XLSX</span>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reports-container h1 {
      margin-bottom: 1.5rem;
    }
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .report-card {
      text-align: center;
    }
    .report-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin: 1rem auto;
    }
    .report-icon.csv {
      color: #4caf50;
    }
    .report-icon.xlsx {
      color: #2196f3;
    }
    .report-card p {
      color: #666;
      margin-bottom: 1rem;
    }
    mat-card-actions {
      padding: 1rem;
      justify-content: center;
    }
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 auto;
    }
  `],
})
export class ReportsComponent {
  exportingCsv = false;
  exportingXlsx = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  exportCsv(): void {
    this.exportingCsv = true;
    this.apiService.exportCsv().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'products.csv');
        this.exportingCsv = false;
        this.snackBar.open('CSV exported successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.exportingCsv = false;
        this.snackBar.open(err.error?.message || 'Export failed', 'Close', { duration: 5000 });
      },
    });
  }

  exportXlsx(): void {
    this.exportingXlsx = true;
    this.apiService.exportXlsx().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'products.xlsx');
        this.exportingXlsx = false;
        this.snackBar.open('XLSX exported successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.exportingXlsx = false;
        this.snackBar.open(err.error?.message || 'Export failed', 'Close', { duration: 5000 });
      },
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
