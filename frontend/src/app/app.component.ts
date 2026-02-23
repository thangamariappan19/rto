import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    SidebarComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Side Navigation Rail -->
      <nav class="app-nav">
        <div class="nav-brand" style="margin-bottom: 2rem; cursor: pointer;" routerLink="/dashboard" title="Home">
          <mat-icon style="color: var(--accent-primary); font-size: 32px; width: 32px; height: 32px;">grid_view</mat-icon>
        </div>
        
        <div class="nav-item" routerLink="/dashboard" routerLinkActive="active" title="Dashboard">
          <mat-icon>dashboard</mat-icon>
        </div>
        
        <div class="nav-item" routerLink="/employees" routerLinkActive="active" title="Employees">
          <mat-icon>people</mat-icon>
        </div>
        
        <div class="nav-item" routerLink="/analytics" routerLinkActive="active" title="Analytics">
          <mat-icon>analytics</mat-icon>
        </div>
        
        <div class="nav-item" title="Settings" style="margin-top: auto;">
          <mat-icon>settings</mat-icon>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <!-- Right Sidebar (Visible on Dashboard and Analytics) -->
      @if (showSidebar()) {
        <app-sidebar class="animate-in"></app-sidebar>
      }

      <!-- Mobile Bottom Navigation -->
      <nav class="mobile-nav">
        <div class="mobile-nav-item" routerLink="/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          <span>Home</span>
        </div>
        <div class="mobile-nav-item" routerLink="/employees" routerLinkActive="active">
          <mat-icon>people</mat-icon>
          <span>Team</span>
        </div>
        <div class="mobile-nav-item" routerLink="/analytics" routerLinkActive="active">
          <mat-icon>analytics</mat-icon>
          <span>Insights</span>
        </div>
        <div class="mobile-nav-item">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </div>
      </nav>
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);

  showSidebar() {
    return this.router.url !== '/employees';
  }
}
