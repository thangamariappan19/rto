import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <header>
        <h1>Hybrid Work Predictive Analytics</h1>
      </header>

      <div class="metric-grid">
        <div class="glass-card metric-item">
          <div class="metric-value">124</div>
          <div class="metric-label">Predicted Today</div>
        </div>
        <div class="glass-card metric-item">
          <div class="metric-value">82%</div>
          <div class="metric-label">Peak Occupancy</div>
        </div>
        <div class="glass-card metric-item">
          <div class="metric-value">Low</div>
          <div class="metric-label">Commute Impact</div>
        </div>
        <div class="glass-card metric-item">
          <div class="metric-value">Tues/Wed</div>
          <div class="metric-label">Target RTO Days</div>
        </div>
      </div>

      <div class="glass-card">
        <h2>Occupancy Forecast (30 Days)</h2>
        <canvas id="occupancyChart"></canvas>
      </div>

      <div class="grid-2-col">
        <div class="glass-card">
          <h2>Team Distribution</h2>
          <p>Analyzing behavioral signals across 5 departments.</p>
        </div>
        <div class="glass-card">
          <h2>Floor Utilization</h2>
          <p>Real-time desk allocation trends.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid-2-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 768px) {
      .grid-2-col { grid-template-columns: 1fr; }
    }
    canvas {
      max-height: 400px;
    }
  `]
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.initChart();
  }

  initChart() {
    const ctx = document.getElementById('occupancyChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
        datasets: [{
          label: 'Predicted Occupancy',
          data: Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 70),
          borderColor: '#03dac6',
          backgroundColor: 'rgba(3, 218, 198, 0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Historical Baseline',
          data: Array.from({length: 30}, () => 85),
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderDash: [5, 5],
          pointStyle: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } }
        },
        scales: {
          y: { 
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#fff' }
          },
          x: { 
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#fff' }
          }
        }
      }
    });
  }
}
