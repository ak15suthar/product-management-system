import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon || 'inbox' }}</mat-icon>
      <h3>{{ title || 'No data found' }}</h3>
      <p *ngIf="message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }
    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
    }
    h3 {
      margin-top: 1rem;
      color: #333;
    }
    p {
      color: #666;
      margin-top: 0.5rem;
    }
  `],
})
export class EmptyStateComponent {
  @Input() icon?: string;
  @Input() title?: string;
  @Input() message?: string;
}
