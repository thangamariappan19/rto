import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart, registerables } from 'chart.js';
import { WorkplaceService } from './workplace.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="view-container animate-in">
      <header class="header">
        <div class="header-title">
          <h1>Command Center</h1>
          <p>Real-time workplace intelligence & occupancy tracking</p>
        </div>
        <div class="action-bar">
          <button mat-raised-button color="primary" (click)="refreshData()">
            <mat-icon>refresh</mat-icon> Sync Data
          </button>
          <button mat-stroked-button color="basic" style="border: 1px solid var(--border-subtle); color: var(--text-primary);">
            <mat-icon>download</mat-icon> Export
          </button>
        </div>
      </header>

      <div class="bento-grid">
        <!-- Metric 1 -->
        <div class="bento-item span-1 delay-1">
          <div class="card-label">Total Workforce</div>
          <div class="card-value">{{ workplace.totalEmployees() }}</div>
          <div class="card-trend trend-up">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
            <span>+8% growth</span>
          </div>
          <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">group</mat-icon>
        </div>

        <!-- Metric 2 -->
        <div class="bento-item span-1 delay-2">
          <div class="card-label">Live Occupancy</div>
          <div class="card-value">{{ workplace.officeOccupancy() }}%</div>
          <div class="card-trend trend-up">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
            <span>+12% vs yesterday</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="workplace.officeOccupancy()" style="margin-top: 1rem;"></mat-progress-bar>
        </div>

        <!-- Metric 3 -->
        <div class="bento-item span-1 delay-3">
          <div class="card-label">RTO Compliance</div>
          <div class="card-value">{{ workplace.avgRtoDays() }}</div>
          <div class="card-trend trend-neutral">
            <span>Days/Week Avg</span>
          </div>
           <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">domain</mat-icon>
        </div>

        <!-- Metric 4 -->
        <div class="bento-item span-1 delay-4">
          <div class="card-label">Eco Impact</div>
          <div class="card-value">{{ workplace.energySavings() }}%</div>
          <div class="card-trend trend-up">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">bolt</mat-icon>
            <span>Energy Saved</span>
          </div>
          <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--accent-success); opacity: 0.2; font-size: 48px; width: 48px; height: 48px;">eco</mat-icon>
        </div>

        <!-- Main Chart -->
        <div class="bento-item span-2 row-2 delay-2">
          <div class="card-label">30-Day Occupancy Trend</div>
          <div class="chart-container">
            <canvas id="occupancyChart"></canvas>
          </div>
        </div>

         <!-- Distribution Chart -->
        <div class="bento-item span-2 delay-3">
          <div class="card-label">Department Distribution</div>
           <div class="chart-container" style="height: 200px;">
            <canvas id="departmentChart"></canvas>
          </div>
        </div>

        <!-- Weekly Chart -->
        <div class="bento-item span-2 delay-4">
          <div class="card-label">Peak Traffic Analysis</div>
           <div class="chart-container" style="height: 200px;">
            <canvas id="weeklyChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  workplace = inject(WorkplaceService);

  ngOnInit() {
    this.initCharts();
  }

  refreshData() {
    this.workplace.updateOccupancy(Math.floor(Math.random() * 20) + 70);
    this.initCharts();
  }

  initCharts() {
    setTimeout(() => {
      this.createLineChart('occupancyChart');
      this.createDoughnutChart('departmentChart');
      this.createBarChart('weeklyChart');
    }, 50);
  }

  createLineChart(id: string) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: this.workplace.occupancyTrend().length }, (_, i) => `${i + 1}`),
        datasets: [{
          label: 'Occupancy',
          data: this.workplace.occupancyTrend(),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  createDoughnutChart(id: string) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Eng', 'Mkt', 'Sales', 'HR'],
        datasets: [{
          data: this.workplace.departmentDistribution(),
          backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'],
          borderColor: '#0f172a',
          borderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', font: { size: 10 } }
          }
        }
      }
    });
  }

  createBarChart(id: string) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          data: this.workplace.peakTraffic(),
          backgroundColor: '#6366f1',
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
