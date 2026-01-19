import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

interface EmployeeData {
  name: string;
  department: string;
  attendance: number;
  rtoDays: string[];
  status: string;
}

interface DepartmentStats {
  name: string;
  occupancy: number;
  capacity: number;
  trend: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="app-layout">
      <!-- Side Navigation Rail -->
      <nav class="app-nav">
        <div class="nav-brand" style="margin-bottom: 2rem;">
          <mat-icon style="color: var(--accent-primary); font-size: 32px; width: 32px; height: 32px;">grid_view</mat-icon>
        </div>
        <div class="nav-item active" title="Dashboard">
          <mat-icon>dashboard</mat-icon>
        </div>
        <div class="nav-item" title="Employees">
          <mat-icon>people</mat-icon>
        </div>
        <div class="nav-item" title="Analytics">
          <mat-icon>analytics</mat-icon>
        </div>
        <div class="nav-item" title="Settings" style="margin-top: auto;">
          <mat-icon>settings</mat-icon>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="app-main">
        <header class="header">
          <div class="header-title">
            <h1>Command Center</h1>
            <p>Real-time workplace intelligence & occupancy tracking</p>
          </div>
          <div class="action-bar">
            <button mat-raised-button color="primary">
              <mat-icon>refresh</mat-icon> Sync Data
            </button>
            <button mat-stroked-button color="basic" style="border: 1px solid var(--border-subtle); color: var(--text-primary);">
              <mat-icon>download</mat-icon> Export
            </button>
          </div>
        </header>

        <div class="bento-grid">
          <!-- Metric 1 -->
          <div class="bento-item span-1 animate-in delay-1">
            <div class="card-label">Total Workforce</div>
            <div class="card-value">{{ totalEmployees }}</div>
            <div class="card-trend trend-up">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
              <span>+8% growth</span>
            </div>
            <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">group</mat-icon>
          </div>

          <!-- Metric 2 -->
          <div class="bento-item span-1 animate-in delay-2">
            <div class="card-label">Live Occupancy</div>
            <div class="card-value">{{ officeOccupancy }}%</div>
            <div class="card-trend trend-up">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
              <span>+12% vs yesterday</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="officeOccupancy" style="margin-top: 1rem;"></mat-progress-bar>
          </div>

          <!-- Metric 3 -->
          <div class="bento-item span-1 animate-in delay-3">
            <div class="card-label">RTO Compliance</div>
            <div class="card-value">{{ avgRtoDays }}</div>
            <div class="card-trend trend-neutral">
              <span>Days/Week Avg</span>
            </div>
             <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">domain</mat-icon>
          </div>

          <!-- Metric 4 -->
          <div class="bento-item span-1 animate-in delay-4">
            <div class="card-label">Eco Impact</div>
            <div class="card-value">{{ energySavings }}%</div>
            <div class="card-trend trend-up">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">bolt</mat-icon>
              <span>Energy Saved</span>
            </div>
            <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--accent-success); opacity: 0.2; font-size: 48px; width: 48px; height: 48px;">eco</mat-icon>
          </div>

          <!-- Main Chart -->
          <div class="bento-item span-2 row-2 animate-in delay-2">
            <div class="card-label">30-Day Occupancy Trend</div>
            <div class="chart-container">
              <canvas id="occupancyChart"></canvas>
            </div>
          </div>

           <!-- Distribution Chart -->
          <div class="bento-item span-2 animate-in delay-3">
            <div class="card-label">Department Distribution</div>
             <div class="chart-container" style="height: 200px;">
              <canvas id="departmentChart"></canvas>
            </div>
          </div>

          <!-- Weekly Chart -->
          <div class="bento-item span-2 animate-in delay-4">
            <div class="card-label">Peak Traffic Analysis</div>
             <div class="chart-container" style="height: 200px;">
              <canvas id="weeklyChart"></canvas>
            </div>
          </div>

          <!-- Data Table -->
          <div class="bento-item span-4 animate-in delay-1" style="min-height: 400px; overflow: hidden;">
            <div class="card-label" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Real-time Check-ins</span>
              <mat-icon style="cursor: pointer;">more_horiz</mat-icon>
            </div>
            
            <div style="overflow-x: auto; margin-top: 1rem;">
              <table class="glass-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Attendance Score</th>
                    <th>Preferred Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let employee of employeeData">
                    <td>
                      <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: 600;">{{ employee.name.charAt(0) }}</div>
                        <span style="font-weight: 500;">{{ employee.name }}</span>
                      </div>
                    </td>
                    <td>
                      <span style="padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.05); font-size: 0.8rem;">
                        {{ employee.department }}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <mat-progress-bar mode="determinate" [value]="employee.attendance" style="width: 100px;"></mat-progress-bar>
                        <span style="font-size: 0.8rem;">{{ employee.attendance }}%</span>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <span *ngFor="let day of employee.rtoDays" style="font-size: 0.7rem; color: var(--text-secondary); border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px;">{{ day }}</span>
                      </div>
                    </td>
                    <td>
                      <span [style.color]="getStatusColor(employee.status) === 'primary' ? 'var(--accent-success)' : 'var(--accent-warning)'">
                        ● {{ employee.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar -->
      <aside class="app-aside">
        
        <div class="aside-section">
          <div class="aside-title">
            <mat-icon>lightbulb</mat-icon>
            AI Insights
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div *ngFor="let insight of insights" style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
              <div style="display: flex; gap: 0.8rem; margin-bottom: 0.5rem;">
                <mat-icon [style.color]="insight.color" style="font-size: 20px;">{{ insight.icon }}</mat-icon>
                <div style="font-weight: 600; font-size: 0.9rem;">{{ insight.title }}</div>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">{{ insight.description }}</p>
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--accent-primary);">{{ insight.metric }}</div>
            </div>
          </div>
        </div>

        <div class="aside-section">
          <div class="aside-title">
            <mat-icon>apartment</mat-icon>
            Department Load
          </div>
          
           <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            <div *ngFor="let dept of departmentStats">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                <span style="color: var(--text-secondary);">{{ dept.name }}</span>
                <span>{{ dept.occupancy }}/{{ dept.capacity }}</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="(dept.occupancy / dept.capacity) * 100"></mat-progress-bar>
            </div>
           </div>
        </div>

      </aside>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  totalEmployees = 1247;
  officeOccupancy = 78;
  avgRtoDays = 2.3;
  energySavings = 23;

  employeeData: EmployeeData[] = [
    { name: 'Alice Johnson', department: 'Engineering', attendance: 85, rtoDays: ['Tue', 'Wed'], status: 'Active' },
    { name: 'Bob Smith', department: 'Marketing', attendance: 92, rtoDays: ['Mon', 'Thu'], status: 'Active' },
    { name: 'Carol Davis', department: 'Sales', attendance: 78, rtoDays: ['Wed', 'Fri'], status: 'Active' },
    { name: 'David Wilson', department: 'HR', attendance: 95, rtoDays: ['Tue', 'Thu'], status: 'Active' },
    { name: 'Emma Brown', department: 'Finance', attendance: 88, rtoDays: ['Mon', 'Wed'], status: 'Active' },
    { name: 'Frank Miller', department: 'Engineering', attendance: 76, rtoDays: ['Thu', 'Fri'], status: 'Remote' },
    { name: 'Grace Lee', department: 'Design', attendance: 91, rtoDays: ['Tue', 'Wed'], status: 'Active' },
    { name: 'Henry Taylor', department: 'Operations', attendance: 83, rtoDays: ['Mon', 'Fri'], status: 'Active' }
  ];

  departmentStats: DepartmentStats[] = [
    { name: 'Engineering', occupancy: 45, capacity: 60, trend: 8 },
    { name: 'Marketing', occupancy: 28, capacity: 35, trend: -3 },
    { name: 'Sales', occupancy: 32, capacity: 40, trend: 12 },
    { name: 'HR', occupancy: 15, capacity: 20, trend: 5 },
    { name: 'Finance', occupancy: 22, capacity: 25, trend: -2 },
    { name: 'Design', occupancy: 18, capacity: 22, trend: 15 }
  ];

  insights = [
    {
      title: 'Peak Capacity Alert',
      description: 'Engineering department approaching limits on Wednesdays.',
      metric: '75% utilization',
      icon: 'warning',
      color: '#f59e0b'
    },
    {
      title: 'Energy Optimization',
      description: 'Smart scheduling reduced HVAC load.',
      metric: '-18% energy use',
      icon: 'eco',
      color: '#10b981'
    },
    {
      title: 'Commute Efficiency',
      description: 'Tuesday offers best traffic patterns.',
      metric: '32% faster commute',
      icon: 'commute',
      color: '#6366f1'
    }
  ];

  ngOnInit() {
    this.verifyChartRegistration();
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  // Ensure necessary components are registered
  verifyChartRegistration() {
    // Already registered via registerables, but good to double check specific controllers if needed
  }

  getStatusColor(status: string): string {
    return status === 'Active' ? 'primary' : 'accent';
  }

  initCharts() {
    this.initOccupancyChart();
    this.initDepartmentChart();
    this.initWeeklyChart();
  }

  initOccupancyChart() {
    const ctx = document.getElementById('occupancyChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '5', '10', '15', '20', '25', '30'],
        datasets: [{
          label: 'Prediction',
          data: [65, 72, 68, 75, 82, 78, 85],
          borderColor: '#6366f1',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }, {
          label: 'Actual',
          data: [60, 68, 65, 70, 75, 76, 80],
          borderColor: '#0ea5e9',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: { display: false },
          y: { 
            display: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            border: { display: false },
            ticks: { color: '#64748b' } 
          }
        }
      }
    });
  }

  initDepartmentChart() {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Eng', 'Mkt', 'Sales', 'HR'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { 
            position: 'right',
            labels: { color: '#94a3b8', boxWidth: 10 } 
          }
        }
      }
    });
  }

  initWeeklyChart() {
    const ctx = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Attendance',
          data: [85, 92, 88, 76, 65],
          backgroundColor: '#6366f1',
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { 
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          },
          y: { display: false }
        }
      }
    });
  }
}
