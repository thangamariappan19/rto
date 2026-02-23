import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { EmployeesComponent } from './employees.component';
import { AnalyticsComponent } from './analytics.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'analytics', component: AnalyticsComponent },
];
