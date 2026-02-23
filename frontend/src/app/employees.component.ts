import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { WorkplaceService } from './workplace.service';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatMenuModule],
    template: `
    <div class="view-container animate-in">
       <header class="header">
        <div class="header-title">
          <h1>Employee Roster</h1>
          <p>Manage workforce status and RTO compliance</p>
        </div>
         <div class="action-bar">
          <div class="search-wrapper">
              <mat-icon style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary);">search</mat-icon>
              <input type="text" 
                     [ngModel]="searchText()" 
                     (ngModelChange)="searchText.set($event)" 
                     placeholder="Search employees..." 
                     class="search-input">
           </div>
          <button mat-raised-button color="primary" (click)="addSampleEmployee()">
            <mat-icon>person_add</mat-icon> Quick Add
          </button>
          <button mat-stroked-button color="basic" [matMenuTriggerFor]="filterMenu" style="border: 1px solid var(--border-subtle); color: var(--text-primary);">
            <mat-icon>filter_list</mat-icon> {{ filterDepartment() || 'Filter' }}
          </button>
          <mat-menu #filterMenu="matMenu">
            <button mat-menu-item (click)="filterDepartment.set('')">All Departments</button>
            @for (dept of departments; track dept) {
              <button mat-menu-item (click)="filterDepartment.set(dept)">{{ dept }}</button>
            }
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
              @for (employee of filteredEmployees(); track employee.name) {
                <tr>
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
                      @for (day of employee.rtoDays; track day) {
                        <span style="font-size: 0.7rem; color: var(--text-secondary); border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px;">{{ day }}</span>
                      }
                    </div>
                  </td>
                  <td style="color: var(--text-secondary); font-size: 0.85rem;">Senior Staff</td>
                  <td style="color: var(--text-secondary); font-size: 0.85rem;">Today, 09:12 AM</td>
                  <td>
                    <span [style.color]="employee.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-warning)'">
                      ● {{ employee.status }}
                    </span>
                  </td>
                  <td>
                    <mat-icon style="color: var(--text-secondary); cursor: pointer; font-size: 18px;">more_vert</mat-icon>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No employees found matching your criteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EmployeesComponent {
    workplace = inject(WorkplaceService);

    searchText = signal('');
    filterDepartment = signal('');

    departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];

    addSampleEmployee() {
        const names = ['John Doe', 'Jane Smith', 'Mike Ross', 'Rachel Zane', 'Harvey Specter'];
        const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];
        const randomName = names[Math.floor(Math.random() * names.length)] + ' ' + Math.random().toString(36).substring(7).toUpperCase();
        const randomDept = depts[Math.floor(Math.random() * depts.length)];
        const randomAttendance = Math.floor(Math.random() * 40) + 60;

        this.workplace.addEmployee({
            name: randomName,
            department: randomDept,
            attendance: randomAttendance,
            rtoDays: ['Tue', 'Thu'],
            status: 'Active'
        });
    }

    filteredEmployees = computed(() => {
        const search = this.searchText().toLowerCase();
        const dept = this.filterDepartment();

        return this.workplace.employees().filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(search);
            const matchesDept = dept ? emp.department === dept : true;
            return matchesSearch && matchesDept;
        });
    });
}
