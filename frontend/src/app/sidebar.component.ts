import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WorkplaceService } from './workplace.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatProgressBarModule],
    template: `
    <aside class="app-aside">
      <div class="aside-section">
        <div class="aside-title">
          <mat-icon>lightbulb</mat-icon>
          AI Insights
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          @for (insight of workplace.insights(); track insight.title) {
            <div class="insight-card">
              <div style="display: flex; gap: 0.8rem; margin-bottom: 0.5rem;">
                <mat-icon [style.color]="insight.color" style="font-size: 20px;">{{ insight.icon }}</mat-icon>
                <div style="font-weight: 600; font-size: 0.9rem;">{{ insight.title }}</div>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">{{ insight.description }}</p>
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--accent-primary);">{{ insight.metric }}</div>
            </div>
          }
        </div>
      </div>

      <div class="aside-section">
        <div class="aside-title">
          <mat-icon>apartment</mat-icon>
          Department Load
        </div>
        
         <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          @for (dept of workplace.departmentStats(); track dept.name) {
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                <span style="color: var(--text-secondary);">{{ dept.name }}</span>
                <span>{{ dept.occupancy }}/{{ dept.capacity }}</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="(dept.occupancy / dept.capacity) * 100"></mat-progress-bar>
            </div>
          }
         </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
    workplace = inject(WorkplaceService);
}
