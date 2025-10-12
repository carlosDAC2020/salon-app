import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ReportsService, 
  MonthlyRevenue, 
  EmployeePerformance, 
  ServiceReport, 
  ClientReport,
  RevenueByCategory
} from '../../core/services/reports.service';
import { AppointmentsService } from '../../core/services/appointments.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  monthlyRevenue: MonthlyRevenue[] = [];
  employeePerformance: EmployeePerformance[] = [];
  serviceReports: ServiceReport[] = [];
  clientReport: ClientReport | null = null;
  revenueByCategory: RevenueByCategory[] = [];
  appointmentStatusDistribution: any[] = [];

  totalRevenue: number = 0;
  totalAppointments: number = 0;
  averageTicket: number = 0;

  selectedPeriod: string = '6';

  constructor(
    private reportsService: ReportsService,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const months = parseInt(this.selectedPeriod);
    this.monthlyRevenue = this.reportsService.getMonthlyRevenue(months);
    this.employeePerformance = this.reportsService.getEmployeePerformance();
    this.serviceReports = this.reportsService.getServiceReports();
    this.clientReport = this.reportsService.getClientReport();
    this.revenueByCategory = this.reportsService.getRevenueByCategory();
    this.appointmentStatusDistribution = this.reportsService.getAppointmentStatusDistribution();
    
    this.totalRevenue = this.reportsService.getTotalRevenue();
    this.totalAppointments = this.reportsService.getTotalAppointments();
    this.averageTicket = this.reportsService.getAverageTicket();
  }

  onPeriodChange(): void {
    this.loadReports();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getMaxRevenue(): number {
    return Math.max(...this.monthlyRevenue.map(m => m.revenue), 1);
  }

  getRevenuePercentage(revenue: number): number {
    const max = this.getMaxRevenue();
    return (revenue / max) * 100;
  }

  getMaxEmployeeRevenue(): number {
    return Math.max(...this.employeePerformance.map(e => e.revenue), 1);
  }

  getEmployeeRevenuePercentage(revenue: number): number {
    const max = this.getMaxEmployeeRevenue();
    return (revenue / max) * 100;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'no_show': 'No Asistió'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'confirmed': '#3b82f6',
      'in_progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444',
      'no_show': '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  getCategoryColor(index: number): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    return colors[index % colors.length];
  }

  exportReport(): void {
    // Funcionalidad de exportación - placeholder
    alert('Funcionalidad de exportación en desarrollo');
  }

  printReport(): void {
    window.print();
  }
}

