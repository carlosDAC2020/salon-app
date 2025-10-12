import { Injectable } from '@angular/core';
import { AppointmentsService } from './appointments.service';
import { ClientsService } from './clients.service';
import { EmployeesService } from './employees.service';
import { ServicesService } from './services.service';
import { AppointmentStatus } from '../models/appointment.model';

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  monthRevenue: number;
  activeClients: number;
  pendingAppointments: number;
  completedToday: number;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface TopService {
  name: string;
  count: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private appointmentsService: AppointmentsService,
    private clientsService: ClientsService,
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) {}

  getStats(): DashboardStats {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allAppointments = this.appointmentsService.getAll();
    
    // Citas de hoy
    const todayAppointments = allAppointments.filter(a => {
      const appointmentDate = new Date(a.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });

    // Ingresos de hoy
    const todayRevenue = todayAppointments
      .filter(a => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + a.price, 0);

    // Ingresos del mes
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthRevenue = allAppointments
      .filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate.getMonth() === currentMonth &&
               appointmentDate.getFullYear() === currentYear &&
               a.status === AppointmentStatus.COMPLETED;
      })
      .reduce((sum, a) => sum + a.price, 0);

    // Clientes activos
    const activeClients = this.clientsService.getActive().length;

    // Citas pendientes
    const pendingAppointments = allAppointments.filter(a => 
      a.status === AppointmentStatus.PENDING || 
      a.status === AppointmentStatus.CONFIRMED
    ).length;

    // Completadas hoy
    const completedToday = todayAppointments.filter(a => 
      a.status === AppointmentStatus.COMPLETED
    ).length;

    return {
      todayAppointments: todayAppointments.length,
      todayRevenue,
      monthRevenue,
      activeClients,
      pendingAppointments,
      completedToday
    };
  }

  getRevenueLastDays(days: number = 7): RevenueData[] {
    const allAppointments = this.appointmentsService.getAll();
    const result: RevenueData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayAppointments = allAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        const isSameDay = appointmentDate.getTime() === date.getTime();
        const isCompleted = a.status === AppointmentStatus.COMPLETED;
        return isSameDay && isCompleted;
      });

      const dayRevenue = dayAppointments.reduce((sum, a) => sum + a.price, 0);

      result.push({
        date: date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
        amount: dayRevenue
      });
    }

    return result;
  }

  getTopServices(limit: number = 5): TopService[] {
    const allAppointments = this.appointmentsService.getAll();
    const serviceStats = new Map<string, { count: number; revenue: number }>();

    allAppointments
      .filter(a => a.status === AppointmentStatus.COMPLETED)
      .forEach(a => {
        const current = serviceStats.get(a.serviceName!) || { count: 0, revenue: 0 };
        serviceStats.set(a.serviceName!, {
          count: current.count + 1,
          revenue: current.revenue + a.price
        });
      });

    return Array.from(serviceStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getUpcomingAppointments(limit: number = 5) {
    return this.appointmentsService.getUpcoming().slice(0, limit);
  }

  getRecentClients(limit: number = 5) {
    return this.clientsService.getAll()
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
      .slice(0, limit);
  }
}
