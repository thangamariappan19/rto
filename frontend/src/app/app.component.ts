import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <header class="animate-in">
        <h1>Hybrid Work Intelligence</h1>
        <p>Predictive analytics for the modern workforce 1.2</p>
      </header>

      <div class="metric-grid">
        <div class="glass-card metric-item animate-in delay-1">
          <div class="metric-value">124</div>
          <div class="metric-label">Predicted Today</div>
          <div class="metric-trend trend-up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            12% increase
          </div>
        </div>
        <div class="glass-card metric-item animate-in delay-2">
          <div class="metric-value">82%</div>
          <div class="metric-label">Peak Occupancy</div>
          <div class="metric-trend trend-up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            5% vs last week
          </div>
        </div>
        <div class="glass-card metric-item animate-in delay-3">
          <div class="metric-value">Low</div>
          <div class="metric-label">Commute Impact</div>
          <div class="metric-trend">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Optimal travel window
          </div>
        </div>
        <div class="glass-card metric-item animate-in delay-4">
          <div class="metric-value">Tue/Wed</div>
          <div class="metric-label">Target RTO Days</div>
          <div class="metric-trend">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Max team overlap
          </div>
        </div>
      </div>

      <div class="grid-2-col">
        <div class="glass-card animate-in delay-3">
          <h2>Occupancy Forecast (30 Days)</h2>
          <div class="chart-wrapper">
            <canvas id="occupancyChart"></canvas>
          </div>
        </div>
        
        <div class="glass-card animate-in delay-4">
          <h2>Insights & Performance</h2>
          <div class="insight-list">
            <div class="insight-item">
              <div class="insight-icon prim">AI</div>
              <div class="insight-content">
                <h3>Recommended Capacity</h3>
                <p>Increase floor 4 access by 15% for Wednesday peak.</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon sec">⚡</div>
              <div class="insight-content">
                <h3>Energy Efficiency</h3>
                <p>Consolidating zones on Friday could save 22% energy.</p>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon acc">📍</div>
              <div class="insight-content">
                <h3>Regional Spikes</h3>
                <p>Seattle office showing 40% higher Tuesday attendance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      position: relative;
      height: 350px;
      width: 100%;
    }
    
    .insight-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .insight-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      transition: background 0.3s ease;
    }
    
    .insight-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }
    
    .insight-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .insight-icon.prim { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
    .insight-icon.sec { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .insight-icon.acc { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    
    .insight-content h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #fff;
    }
    
    .insight-content p {
      font-size: 0.85rem;
      margin: 0;
      color: var(--text-muted);
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .dashboard-container { padding: 24px 16px; }
      header h1 { font-size: 2rem; }
    }
  `]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  initChart() {
    const ctx = document.getElementById('occupancyChart') as HTMLCanvasElement;
    if (!ctx) return;

    const primaryColor = '#6366f1';
    const secondaryColor = '#10b981';

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'AI Prediction',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 60),
          borderColor: primaryColor,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: primaryColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }, {
          label: 'Baseline',
          data: Array.from({ length: 30 }, () => 75),
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 2,
          borderDash: [6, 6],
          pointStyle: false,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#94a3b8',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: { size: 12, weight: 'bold' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            padding: 12,
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            displayColors: true,
            usePointStyle: true,
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            border: { display: false },
            ticks: {
              color: '#64748b',
              padding: 10,
              callback: (value) => value + '%'
            },
            min: 0,
            max: 100
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#64748b',
              padding: 10,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        }
      }
    });
  }
}
