import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Chart, registerables } from 'chart.js';
import { WorkplaceService } from './workplace.service';

Chart.register(...registerables);

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule],
    template: `
    <div class="view-container animate-in">
       <header class="header">
        <div class="header-title">
          <div class="page-title-row">
            <h1>Deep Analytics</h1>
            @if (isFutureDate()) {
              <mat-chip color="accent" selected class="prediction-chip">
                <mat-icon style="font-size: 18px; margin-right: 4px; color: inherit;">auto_awesome</mat-icon>
                <span style="color: inherit; font-weight: 700;">PREDICTION MODE</span>
              </mat-chip>
            }
          </div>
          <p>Workplace utilization insights and forecasting</p>
        </div>
         <div class="action-bar">
          <button mat-icon-button (click)="changeMonth(-1)" style="color: var(--text-primary);">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button mat-stroked-button color="basic" style="border: 1px solid var(--border-subtle); color: var(--text-primary); min-width: 150px;">
            <mat-icon>date_range</mat-icon> 
            {{ analyticsDate() | date:'MMMM yyyy' }}
          </button>
          <button mat-icon-button (click)="changeMonth(1)" style="color: var(--text-primary);">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </header>

      <div class="bento-grid">
        <div class="bento-item span-2 row-2 delay-1">
          <div class="card-label">
            {{ isFutureDate() ? 'Predicted Occupancy Rates' : 'Occupancy Trends' }}
          </div>
          <div class="chart-container">
             <canvas id="analyticsOccupancyChart"></canvas>
          </div>
        </div>
        
         <div class="bento-item span-2 delay-2">
          <div class="card-label">Resource Usage</div>
          <div class="chart-container" style="height: 200px;">
             <canvas id="analyticsResourceChart"></canvas>
          </div>
        </div>

         <div class="bento-item span-2 delay-3">
          <div class="card-label">Weekly Peak Analysis</div>
          <div class="chart-container" style="height: 200px;">
             <canvas id="analyticsWeeklyChart"></canvas>
          </div>
        </div>
        
        <div class="bento-item span-4 delay-4">
          <div class="card-label">Key Observations</div>
          <div class="key-observations-grid">
            <div class="observation-card">
              <div style="color: var(--accent-secondary); font-size: 2rem; font-weight: 700;">
                {{ isFutureDate() ? '+35%' : '+24%' }}
              </div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Meeting Room Demand</div>
              <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                {{ isFutureDate() ? 'Projected surge due to quarter-end planning.' : 'Highest utilization recorded in Building A, Floor 3.' }}
              </p>
            </div>
             <div class="observation-card">
              <div style="color: var(--accent-warning); font-size: 2rem; font-weight: 700;">Tue/Thu</div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Most Popular Days</div>
              <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">Consistently reaching 90% capacity on these days.</p>
            </div>
             <div class="observation-card">
              <div style="color: var(--accent-success); font-size: 2rem; font-weight: 700;">
                {{ isFutureDate() ? '100% Est.' : '98%' }}
              </div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Health Safety Compliance</div>
              <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">All zones adhering to new ventilation standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
    workplace = inject(WorkplaceService);
    analyticsDate = signal(new Date());

    isFutureDate = computed(() => {
        const today = new Date();
        const date = this.analyticsDate();
        return date.getTime() > today.getTime() && date.getMonth() !== today.getMonth();
    });

    ngOnInit() {
        this.updateCharts();
    }

    changeMonth(delta: number) {
        const newDate = new Date(this.analyticsDate());
        newDate.setMonth(newDate.getMonth() + delta);
        this.analyticsDate.set(newDate);
        this.updateCharts();
    }

    updateCharts() {
        setTimeout(() => {
            const isPrediction = this.isFutureDate();
            const seed = this.analyticsDate().getMonth();
            const volatility = isPrediction ? 15 : 5;

            const occupancyData = Array.from({ length: 30 }, () => 60 + (seed * 2) + Math.random() * volatility);
            const resourceData = [75 + seed, 80 - seed, 60 + seed, 90, 40];
            const peakData = [80, 90 + (seed % 2 * 5), 85, 75, 60];

            this.createLineChart('analyticsOccupancyChart', occupancyData, isPrediction);
            this.createBarChart('analyticsResourceChart', resourceData, isPrediction);
            this.createBarChart('analyticsWeeklyChart', peakData, isPrediction);
        }, 50);
    }

    createLineChart(id: string, dataPoints: number[], isPrediction: boolean) {
        const ctx = document.getElementById(id) as HTMLCanvasElement;
        if (!ctx) return;
        const existing = Chart.getChart(id);
        if (existing) existing.destroy();

        const color = isPrediction ? '#f59e0b' : '#6366f1';

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: dataPoints.length }, (_, i) => `${i + 1}`),
                datasets: [{
                    label: isPrediction ? 'Projected' : 'Actual',
                    data: dataPoints,
                    borderColor: color,
                    borderDash: isPrediction ? [6, 4] : [],
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { beginAtZero: true, max: 120, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    createBarChart(id: string, dataPoints: number[], isPrediction: boolean) {
        const ctx = document.getElementById(id) as HTMLCanvasElement;
        if (!ctx) return;
        const existing = Chart.getChart(id);
        if (existing) existing.destroy();

        const color = isPrediction ? '#f59e0b' : '#6366f1';

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    data: dataPoints,
                    backgroundColor: color,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { display: false }
                }
            }
        });
    }
}
