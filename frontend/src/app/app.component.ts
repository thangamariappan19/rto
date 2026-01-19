import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="app-layout">
      <!-- Side Navigation Rail -->
      <nav class="app-nav">
        <div class="nav-brand" style="margin-bottom: 2rem; cursor: pointer;" (click)="setView('dashboard')" title="Home">
          <mat-icon style="color: var(--accent-primary); font-size: 32px; width: 32px; height: 32px;">grid_view</mat-icon>
        </div>
        <div class="nav-item" [class.active]="currentView === 'dashboard'" (click)="setView('dashboard')" title="Dashboard">
          <mat-icon>dashboard</mat-icon>
        </div>
        <div class="nav-item" [class.active]="currentView === 'employees'" (click)="setView('employees')" title="Employees">
          <mat-icon>people</mat-icon>
        </div>
        <div class="nav-item" [class.active]="currentView === 'analytics'" (click)="setView('analytics')" title="Analytics">
          <mat-icon>analytics</mat-icon>
        </div>
        <div class="nav-item" title="Settings" style="margin-top: auto;">
          <mat-icon>settings</mat-icon>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="app-main">
        
        <!-- DASHBOARD VIEW -->
        <div *ngIf="currentView === 'dashboard'" class="view-container animate-in">
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
            <div class="bento-item span-1 delay-1">
              <div class="card-label">Total Workforce</div>
              <div class="card-value">{{ totalEmployees }}</div>
              <div class="card-trend trend-up">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
                <span>+8% growth</span>
              </div>
              <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">group</mat-icon>
            </div>

            <!-- Metric 2 -->
            <div class="bento-item span-1 delay-2">
              <div class="card-label">Live Occupancy</div>
              <div class="card-value">{{ officeOccupancy }}%</div>
              <div class="card-trend trend-up">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;">trending_up</mat-icon>
                <span>+12% vs yesterday</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="officeOccupancy" style="margin-top: 1rem;"></mat-progress-bar>
            </div>

            <!-- Metric 3 -->
            <div class="bento-item span-1 delay-3">
              <div class="card-label">RTO Compliance</div>
              <div class="card-value">{{ avgRtoDays }}</div>
              <div class="card-trend trend-neutral">
                <span>Days/Week Avg</span>
              </div>
               <mat-icon style="position: absolute; right: 20px; top: 20px; color: var(--border-subtle); font-size: 48px; width: 48px; height: 48px;">domain</mat-icon>
            </div>

            <!-- Metric 4 -->
            <div class="bento-item span-1 delay-4">
              <div class="card-label">Eco Impact</div>
              <div class="card-value">{{ energySavings }}%</div>
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

        <!-- EMPLOYEES VIEW -->
        <div *ngIf="currentView === 'employees'" class="view-container animate-in">
           <header class="header">
            <div class="header-title">
              <h1>Employee Roster</h1>
              <p>Manage workforce status and RTO compliance</p>
            </div>
             <div class="action-bar">
               <div class="search-wrapper">
                  <mat-icon style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary);">search</mat-icon>
                  <input type="text" [(ngModel)]="searchText" placeholder="Search employees..." class="search-input">
               </div>
              <button mat-stroked-button color="basic" [matMenuTriggerFor]="filterMenu" style="border: 1px solid var(--border-subtle); color: var(--text-primary);">
                <mat-icon>filter_list</mat-icon> {{ filterDepartment || 'Filter' }}
              </button>
              <mat-menu #filterMenu="matMenu">
                <button mat-menu-item (click)="filterDepartment = ''">All Departments</button>
                <button mat-menu-item (click)="filterDepartment = 'Engineering'">Engineering</button>
                <button mat-menu-item (click)="filterDepartment = 'Marketing'">Marketing</button>
                <button mat-menu-item (click)="filterDepartment = 'Sales'">Sales</button>
                <button mat-menu-item (click)="filterDepartment = 'HR'">HR</button>
              </mat-menu>
            </div>
          </header>

          <div class="bento-item span-4 delay-1" style="min-height: 600px; overflow: hidden;">
            <div style="overflow-x: auto;">
              <table class="glass-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Attendance Score</th>
                    <th>Preferred Days</th>
                    <th>Role</th>
                    <th>Last Check-in</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let employee of filteredEmployees">
                    <td>
                      <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: 600;">{{ employee.name.charAt(0) }}</div>
                        <div>
                          <div style="font-weight: 500;">{{ employee.name }}</div>
                          <div style="font-size: 0.75rem; color: var(--text-secondary);">ID: #829{{employee.attendance}}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style="padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.05); font-size: 0.8rem;">
                        {{ employee.department }}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <mat-progress-bar mode="determinate" [value]="employee.attendance" style="width: 80px;"></mat-progress-bar>
                        <span style="font-size: 0.8rem;">{{ employee.attendance }}%</span>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <span *ngFor="let day of employee.rtoDays" style="font-size: 0.7rem; color: var(--text-secondary); border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px;">{{ day }}</span>
                      </div>
                    </td>
                    <td style="color: var(--text-secondary); font-size: 0.85rem;">Senior Staff</td>
                    <td style="color: var(--text-secondary); font-size: 0.85rem;">Today, 09:12 AM</td>
                    <td>
                      <span [style.color]="getStatusColor(employee.status) === 'primary' ? 'var(--accent-success)' : 'var(--accent-warning)'">
                        ● {{ employee.status }}
                      </span>
                    </td>
                    <td>
                      <mat-icon style="color: var(--text-secondary); cursor: pointer; font-size: 18px;">more_vert</mat-icon>
                    </td>
                  </tr>
                  <tr *ngIf="filteredEmployees.length === 0">
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                      No employees found matching your criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ANALYTICS VIEW -->
        <div *ngIf="currentView === 'analytics'" class="view-container animate-in">
           <header class="header">
            <div class="header-title">
              <div class="page-title-row">
                <h1>Deep Analytics</h1>
                <mat-chip *ngIf="isFutureDate" color="accent" selected class="prediction-chip">
                  <mat-icon style="font-size: 18px; margin-right: 4px; color: inherit;">auto_awesome</mat-icon>
                  <span style="color: inherit; font-weight: 700;">PREDICTION MODE</span>
                </mat-chip>
              </div>
              <p>Workplace utilization insights and forecasting</p>
            </div>
             <div class="action-bar">
              <button mat-icon-button (click)="changeMonth(-1)" style="color: var(--text-primary);">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <button mat-stroked-button color="basic" style="border: 1px solid var(--border-subtle); color: var(--text-primary); min-width: 150px;">
                <mat-icon>date_range</mat-icon> 
                {{ analyticsDate | date:'MMMM yyyy' }}
              </button>
              <button mat-icon-button (click)="changeMonth(1)" style="color: var(--text-primary);">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
          </header>

          <div class="bento-grid">
            <div class="bento-item span-2 row-2 delay-1">
              <div class="card-label">
                {{ isFutureDate ? 'Predicted Occupancy Rates' : 'Occupancy Trends' }}
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
                <!-- DYNAMIC CARDS BASED ON DATE -->
                <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
                  <div style="color: var(--accent-secondary); font-size: 2rem; font-weight: 700;">
                    {{ isFutureDate ? '+35%' : '+24%' }}
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.9rem;">Meeting Room Demand</div>
                  <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                    {{ isFutureDate ? 'Projected surge due to quarter-end planning.' : 'Highest utilization recorded in Building A, Floor 3.' }}
                  </p>
                </div>
                 <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
                  <div style="color: var(--accent-warning); font-size: 2rem; font-weight: 700;">Tue/Thu</div>
                  <div style="color: var(--text-secondary); font-size: 0.9rem;">Most Popular Days</div>
                  <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">Consistently reaching 90% capacity on these days.</p>
                </div>
                 <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
                  <div style="color: var(--accent-success); font-size: 2rem; font-weight: 700;">
                    {{ isFutureDate ? '100% Est.' : '98%' }}
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.9rem;">Health Safety Compliance</div>
                  <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">All zones adhering to new ventilation standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <!-- Right Sidebar (Only for Dashboard/Analytics) -->
      <aside class="app-aside" *ngIf="currentView !== 'employees'">
        
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

      <!-- Mobile Bottom Navigation -->
      <nav class="mobile-nav">
        <div class="mobile-nav-item" [class.active]="currentView === 'dashboard'" (click)="setView('dashboard')">
          <mat-icon>dashboard</mat-icon>
          <span>Home</span>
        </div>
        <div class="mobile-nav-item" [class.active]="currentView === 'employees'" (click)="setView('employees')">
          <mat-icon>people</mat-icon>
          <span>Team</span>
        </div>
        <div class="mobile-nav-item" [class.active]="currentView === 'analytics'" (click)="setView('analytics')">
          <mat-icon>analytics</mat-icon>
          <span>Insights</span>
        </div>
        <div class="mobile-nav-item">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </div>
      </nav>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  currentView: 'dashboard' | 'employees' | 'analytics' = 'dashboard';

  // Search and Filter State
  searchText: string = '';
  filterDepartment: string = '';

  // Analytics State
  analyticsDate: Date = new Date();

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
    this.setView('dashboard');
  }

  get filteredEmployees(): EmployeeData[] {
    return this.employeeData.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesFilter = this.filterDepartment ? emp.department === this.filterDepartment : true;
      return matchesSearch && matchesFilter;
    });
  }

  get isFutureDate(): boolean {
    const today = new Date();
    return this.analyticsDate > today &&
      this.analyticsDate.getMonth() !== today.getMonth();
  }

  setView(view: 'dashboard' | 'employees' | 'analytics') {
    this.currentView = view;
    setTimeout(() => {
      if (view === 'dashboard') {
        this.initDashboardCharts();
      } else if (view === 'analytics') {
        this.updateAnalyticsCharts();
      }
    }, 100);
  }

  changeMonth(delta: number) {
    const newDate = new Date(this.analyticsDate);
    newDate.setMonth(newDate.getMonth() + delta);
    this.analyticsDate = newDate;
    this.updateAnalyticsCharts();
  }

  getStatusColor(status: string): string {
    return status === 'Active' ? 'primary' : 'accent';
  }

  // --- Dashboard Charts ---
  initDashboardCharts() {
    this.createLineChart('occupancyChart');
    this.createDoughnutChart('departmentChart');
    this.createBarChart('weeklyChart');
  }

  // --- Analytics Charts with Prediction Mode ---
  updateAnalyticsCharts() {
    // Determine data mode based on whether date is in the future
    const isPrediction = this.isFutureDate;

    // Simulate changing data based on month
    const seed = this.analyticsDate.getMonth();
    const volatility = isPrediction ? 15 : 5;

    // Generate data
    const occupancyData = Array.from({ length: 30 }, () => 60 + (seed * 2) + Math.random() * volatility);
    const resourceData = [75 + seed, 80 - seed, 60 + seed, 90, 40];
    const peakData = [80, 90 + (seed % 2 * 5), 85, 75, 60];

    this.createLineChart('analyticsOccupancyChart', true, occupancyData, isPrediction);
    this.createBarChart('analyticsResourceChart', true, resourceData, isPrediction);
    this.createBarChart('analyticsWeeklyChart', true, peakData, isPrediction);
  }

  // Helper functions to create charts safely
  createLineChart(id: string, isDetailed = false, customData?: number[], isPrediction = false) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;

    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    const dataPoints = customData || [65, 72, 68, 75, 82, 78, 85];
    const color = isPrediction ? '#f59e0b' : '#6366f1';

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: dataPoints.length }, (_, i) => `${i + 1}`),
        datasets: [{
          label: isPrediction ? 'Projected Occupancy' : 'Actual Occupancy',
          data: dataPoints,
          borderColor: color,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, isPrediction ? 'rgba(245, 158, 11, 0.25)' : 'rgba(99, 102, 241, 0.25)');
            gradient.addColorStop(1, isPrediction ? 'rgba(245, 158, 11, 0)' : 'rgba(99, 102, 241, 0)');
            return gradient;
          },
          borderWidth: 2,
          borderDash: isPrediction ? [6, 4] : [],
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#fff',
          pointHitRadius: 20,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: isDetailed,
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: "'Outfit', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 12,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => ` ${(context.parsed.y || 0).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            display: isDetailed,
            grid: { color: 'rgba(255,255,255,0.03)', drawTicks: false },
            ticks: { padding: 10, font: { size: 11 } }
          },
          y: {
            display: true,
            beginAtZero: true,
            max: 120,
            grid: { color: 'rgba(255,255,255,0.03)' },
            ticks: { padding: 10, font: { size: 11 } }
          }
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
          data: [45, 25, 20, 10],
          backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'],
          borderColor: '#0f172a',
          borderWidth: 4,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', boxWidth: 12, padding: 15, font: { size: 11, family: "'Outfit', sans-serif" } }
          }
        }
      }
    });
  }

  createBarChart(id: string, isDetailed = false, customData?: number[], isPrediction = false) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (!ctx) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();

    const dataPoints = customData || [85, 92, 88, 76, 65];
    const color = isPrediction ? '#f59e0b' : '#6366f1';
    const hoverColor = isPrediction ? '#fbbf24' : '#818cf8';

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Usage',
          data: dataPoints,
          backgroundColor: color,
          hoverBackgroundColor: hoverColor,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { weight: 500, size: 11, family: "'Outfit', sans-serif" } }
          },
          y: {
            display: isDetailed,
            grid: { color: 'rgba(255,255,255,0.03)' },
            beginAtZero: true,
            ticks: { padding: 8, font: { size: 11, family: "'Outfit', sans-serif" } }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
}
