import { Injectable } from '@angular/core';
import { AppointmentsService } from './appointments.service';
import { ClientsService } from './clients.service';
import { EmployeesService } from './employees.service';
import { ServicesService } from './services.service';
import { AppointmentStatus } from '../models/appointment.model';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  appointments: number;
}

export interface EmployeePerformance {
  id: string;
  name: string;
  appointments: number;
  revenue: number;
  completionRate: number;
}

export interface ServiceReport {
  id: string;
  name: string;
  totalAppointments: number;
  revenue: number;
  averagePrice: number;
}

export interface ClientReport {
  totalClients: number;
  activeClients: number;
  newThisMonth: number;
  topClients: Array<{
    id: string;
    name: string;
    visits: number;
    spent: number;
  }>;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(
    private appointmentsService: AppointmentsService,
    private clientsService: ClientsService,
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) {}

  getMonthlyRevenue(months: number = 6): MonthlyRevenue[] {
    const result: MonthlyRevenue[] = [];
    const today = new Date();
    const allAppointments = this.appointmentsService.getAll();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });

      const monthAppointments = allAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate.getMonth() === date.getMonth() &&
               appointmentDate.getFullYear() === date.getFullYear() &&
               a.status === AppointmentStatus.COMPLETED;
      });

      result.push({
        month: monthName,
        revenue: monthAppointments.reduce((sum, a) => sum + a.price, 0),
        appointments: monthAppointments.length
      });
    }

    return result;
  }

  getEmployeePerformance(): EmployeePerformance[] {
    const employees = this.employeesService.getAll();
    const allAppointments = this.appointmentsService.getAll();

    return employees.map(employee => {
      const employeeAppointments = allAppointments.filter(a => a.employeeId === employee.id);
      const completedAppointments = employeeAppointments.filter(a => a.status === AppointmentStatus.COMPLETED);
      
      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        appointments: completedAppointments.length,
        revenue: completedAppointments.reduce((sum, a) => sum + a.price, 0),
        completionRate: employeeAppointments.length > 0 
          ? (completedAppointments.length / employeeAppointments.length) * 100 
          : 0
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  getServiceReports(): ServiceReport[] {
    const services = this.servicesService.getAll();
    const allAppointments = this.appointmentsService.getAll()
      .filter(a => a.status === AppointmentStatus.COMPLETED);

    return services.map(service => {
      const serviceAppointments = allAppointments.filter(a => a.serviceId === service.id);
      const totalRevenue = serviceAppointments.reduce((sum, a) => sum + a.price, 0);

      return {
        id: service.id,
        name: service.name,
        totalAppointments: serviceAppointments.length,
        revenue: totalRevenue,
        averagePrice: serviceAppointments.length > 0 ? totalRevenue / serviceAppointments.length : 0
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  getClientReport(): ClientReport {
    const allClients = this.clientsService.getAll();
    const activeClients = allClients.filter(c => c.isActive);
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newThisMonth = allClients.filter(c => 
      new Date(c.registeredAt) >= firstDayOfMonth
    ).length;

    const topClients = allClients
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map(c => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        visits: c.totalVisits,
        spent: c.totalSpent
      }));

    return {
      totalClients: allClients.length,
      activeClients: activeClients.length,
      newThisMonth,
      topClients
    };
  }

  getRevenueByCategory(): RevenueByCategory[] {
    const allAppointments = this.appointmentsService.getAll()
      .filter(a => a.status === AppointmentStatus.COMPLETED);
    
    const services = this.servicesService.getAll();
    const categoryRevenue = new Map<string, number>();

    allAppointments.forEach(appointment => {
      const service = services.find(s => s.id === appointment.serviceId);
      if (service) {
        const current = categoryRevenue.get(service.category) || 0;
        categoryRevenue.set(service.category, current + appointment.price);
      }
    });

    const totalRevenue = Array.from(categoryRevenue.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryRevenue.entries())
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  getAppointmentStatusDistribution() {
    const allAppointments = this.appointmentsService.getAll();
    const statusCount = new Map<AppointmentStatus, number>();

    allAppointments.forEach(appointment => {
      const current = statusCount.get(appointment.status) || 0;
      statusCount.set(appointment.status, current + 1);
    });

    const total = allAppointments.length;

    return Array.from(statusCount.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  }

  getTotalRevenue(): number {
    return this.appointmentsService.getAll()
      .filter(a => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + a.price, 0);
  }

  getTotalAppointments(): number {
    return this.appointmentsService.getAll()
      .filter(a => a.status === AppointmentStatus.COMPLETED).length;
  }

  getAverageTicket(): number {
    const completed = this.appointmentsService.getAll()
      .filter(a => a.status === AppointmentStatus.COMPLETED);
    
    if (completed.length === 0) return 0;
    
    const total = completed.reduce((sum, a) => sum + a.price, 0);
    return total / completed.length;
  }
}
