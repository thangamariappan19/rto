import { Injectable, signal, computed } from '@angular/core';

export interface EmployeeData {
    name: string;
    department: string;
    attendance: number;
    rtoDays: string[];
    status: string;
}

export interface DepartmentStats {
    name: string;
    occupancy: number;
    capacity: number;
    trend: number;
}

export interface Insight {
    title: string;
    description: string;
    metric: string;
    icon: string;
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class WorkplaceService {
    // Signals for state
    private _employeeData = signal<EmployeeData[]>([
        { name: 'Alice Johnson', department: 'Engineering', attendance: 85, rtoDays: ['Tue', 'Wed'], status: 'Active' },
        { name: 'Bob Smith', department: 'Marketing', attendance: 92, rtoDays: ['Mon', 'Thu'], status: 'Active' },
        { name: 'Carol Davis', department: 'Sales', attendance: 78, rtoDays: ['Wed', 'Fri'], status: 'Active' },
        { name: 'David Wilson', department: 'HR', attendance: 95, rtoDays: ['Tue', 'Thu'], status: 'Active' },
        { name: 'Emma Brown', department: 'Finance', attendance: 88, rtoDays: ['Mon', 'Wed'], status: 'Active' },
        { name: 'Frank Miller', department: 'Engineering', attendance: 76, rtoDays: ['Thu', 'Fri'], status: 'Remote' },
        { name: 'Grace Lee', department: 'Design', attendance: 91, rtoDays: ['Tue', 'Wed'], status: 'Active' },
        { name: 'Henry Taylor', department: 'Operations', attendance: 83, rtoDays: ['Mon', 'Fri'], status: 'Active' }
    ]);

    private _departmentStats = signal<DepartmentStats[]>([
        { name: 'Engineering', occupancy: 45, capacity: 60, trend: 8 },
        { name: 'Marketing', occupancy: 28, capacity: 35, trend: -3 },
        { name: 'Sales', occupancy: 32, capacity: 40, trend: 12 },
        { name: 'HR', occupancy: 15, capacity: 20, trend: 5 },
        { name: 'Finance', occupancy: 22, capacity: 25, trend: -2 },
        { name: 'Design', occupancy: 18, capacity: 22, trend: 15 }
    ]);

    private _insights = signal<Insight[]>([
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
    ]);

    // Read-only accessors
    employees = this._employeeData.asReadonly();
    departmentStats = this._departmentStats.asReadonly();
    insights = this._insights.asReadonly();

    // Metrics
    totalEmployees = computed(() => this._employeeData().length * 155);
    officeOccupancy = signal(78);
    avgRtoDays = signal(2.3);
    energySavings = signal(23);

    // Chart Data Signals
    occupancyTrend = signal<number[]>([65, 72, 68, 75, 82, 78, 85]);
    departmentDistribution = signal<number[]>([45, 25, 20, 10]);
    peakTraffic = signal<number[]>([85, 92, 88, 76, 65]);

    constructor() {
        this.loadFromStorage();
    }

    updateOccupancy(value: number) {
        this.officeOccupancy.set(value);
        // Simulate trend update
        this.occupancyTrend.update(vals => [...vals.slice(1), value]);
        this.saveToStorage();
    }

    addEmployee(employee: EmployeeData) {
        this._employeeData.update(emps => [...emps, employee]);
        this.saveToStorage();
    }

    private saveToStorage() {
        localStorage.setItem('rto_occupancy', this.officeOccupancy().toString());
        localStorage.setItem('rto_employees', JSON.stringify(this._employeeData()));
    }

    private loadFromStorage() {
        const savedOcc = localStorage.getItem('rto_occupancy');
        if (savedOcc) this.officeOccupancy.set(parseInt(savedOcc, 10));

        const savedEmps = localStorage.getItem('rto_employees');
        if (savedEmps) {
            try {
                this._employeeData.set(JSON.parse(savedEmps));
            } catch (e) {
                console.error('Failed to load employees', e);
            }
        }
    }
}
