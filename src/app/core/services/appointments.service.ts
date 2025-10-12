import { Injectable } from '@angular/core';
import { Appointment, AppointmentStatus } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointments: Appointment[] = this.generateMockAppointments();

  getAll(): Appointment[] {
    return [...this.appointments];
  }

  getById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  getByDate(date: Date): Appointment[] {
    const targetDate = new Date(date).toDateString();
    return this.appointments.filter(a => 
      new Date(a.date).toDateString() === targetDate
    );
  }

  getByStatus(status: AppointmentStatus): Appointment[] {
    return this.appointments.filter(a => a.status === status);
  }

  getByClient(clientId: string): Appointment[] {
    return this.appointments.filter(a => a.clientId === clientId);
  }

  getByEmployee(employeeId: string): Appointment[] {
    return this.appointments.filter(a => a.employeeId === employeeId);
  }

  getUpcoming(): Appointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && 
             (a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.CONFIRMED);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  create(appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  update(id: string, appointment: Partial<Appointment>): Appointment | undefined {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...appointment,
        updatedAt: new Date()
      };
      return this.appointments[index];
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return true;
    }
    return false;
  }

  updateStatus(id: string, status: AppointmentStatus): Appointment | undefined {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
      return appointment;
    }
    return undefined;
  }

  getStatusInfo(status: AppointmentStatus): { label: string; color: string; icon: string } {
    const statusMap = {
      [AppointmentStatus.PENDING]: { label: 'Pendiente', color: '#f59e0b', icon: 'schedule' },
      [AppointmentStatus.CONFIRMED]: { label: 'Confirmada', color: '#3b82f6', icon: 'check_circle' },
      [AppointmentStatus.IN_PROGRESS]: { label: 'En Progreso', color: '#8b5cf6', icon: 'progress_activity' },
      [AppointmentStatus.COMPLETED]: { label: 'Completada', color: '#10b981', icon: 'task_alt' },
      [AppointmentStatus.CANCELLED]: { label: 'Cancelada', color: '#ef4444', icon: 'cancel' },
      [AppointmentStatus.NO_SHOW]: { label: 'No Asistió', color: '#6b7280', icon: 'person_off' }
    };
    return statusMap[status];
  }

  private generateMockAppointments(): Appointment[] {
    const appointments: Appointment[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Datos para generar citas
    const clients = [
      { id: '1', name: 'Laura Pérez' },
      { id: '2', name: 'Roberto Gómez' },
      { id: '3', name: 'Sofía Rodríguez' },
      { id: '5', name: 'Isabella Martínez' },
      { id: '6', name: 'Camila García' },
      { id: '8', name: 'Valentina Díaz' },
      { id: '10', name: 'Mariana Torres' },
      { id: '12', name: 'Lucía Morales' },
      { id: '14', name: 'Gabriela Castro' },
      { id: '16', name: 'Paula Mendoza' }
    ];

    const employees = [
      { id: '1', name: 'María González' },
      { id: '2', name: 'Carlos Ramírez' },
      { id: '3', name: 'Ana Martínez' },
      { id: '4', name: 'Luis Torres' },
      { id: '5', name: 'Patricia Sánchez' }
    ];

    const services = [
      { id: '1', name: 'Corte de Cabello', duration: 30, price: 25000 },
      { id: '2', name: 'Tinte Completo', duration: 120, price: 80000 },
      { id: '3', name: 'Mechas', duration: 150, price: 120000 },
      { id: '6', name: 'Manicure', duration: 45, price: 30000 },
      { id: '7', name: 'Pedicure', duration: 60, price: 35000 },
      { id: '10', name: 'Tratamiento Facial', duration: 90, price: 60000 },
      { id: '13', name: 'Maquillaje Social', duration: 60, price: 70000 },
      { id: '15', name: 'Masaje Relajante', duration: 60, price: 80000 }
    ];

    let idCounter = 1;

    // Generar citas para los últimos 60 días
    for (let daysAgo = 0; daysAgo < 60; daysAgo++) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(0, 0, 0, 0);
      
      // 3-5 citas por día
      const appointmentsPerDay = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < appointmentsPerDay; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const employee = employees[Math.floor(Math.random() * employees.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        
        const hour = 9 + Math.floor(Math.random() * 8); // 9am - 5pm
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endHour = hour + Math.floor(service.duration / 60);
        const endMinute = service.duration % 60;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        // Determinar estado basado en la fecha
        let status: AppointmentStatus;
        if (daysAgo === 0) {
          // Hoy: mezcla de estados
          const rand = Math.random();
          if (rand < 0.4) status = AppointmentStatus.COMPLETED;
          else if (rand < 0.6) status = AppointmentStatus.IN_PROGRESS;
          else if (rand < 0.8) status = AppointmentStatus.CONFIRMED;
          else status = AppointmentStatus.PENDING;
        } else if (daysAgo < 7) {
          // Última semana: mayoría completadas
          status = Math.random() < 0.9 ? AppointmentStatus.COMPLETED : AppointmentStatus.CANCELLED;
        } else {
          // Más antiguas: todas completadas o canceladas
          status = Math.random() < 0.95 ? AppointmentStatus.COMPLETED : AppointmentStatus.CANCELLED;
        }

        appointments.push({
          id: (idCounter++).toString(),
          clientId: client.id,
          clientName: client.name,
          employeeId: employee.id,
          employeeName: employee.name,
          serviceId: service.id,
          serviceName: service.name,
          date: new Date(date),
          startTime,
          endTime,
          status,
          price: service.price,
          createdAt: new Date(date.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000))
        });
      }
    }

    // Agregar citas futuras (próximos 7 días)
    for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
      const date = new Date(today);
      date.setDate(date.getDate() + daysAhead);
      date.setHours(0, 0, 0, 0);
      
      const appointmentsPerDay = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < appointmentsPerDay; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const employee = employees[Math.floor(Math.random() * employees.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        
        const hour = 9 + Math.floor(Math.random() * 8);
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endHour = hour + Math.floor(service.duration / 60);
        const endMinute = service.duration % 60;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        const status = Math.random() < 0.7 ? AppointmentStatus.CONFIRMED : AppointmentStatus.PENDING;

        appointments.push({
          id: (idCounter++).toString(),
          clientId: client.id,
          clientName: client.name,
          employeeId: employee.id,
          employeeName: employee.name,
          serviceId: service.id,
          serviceName: service.name,
          date: new Date(date),
          startTime,
          endTime,
          status,
          price: service.price,
          createdAt: new Date()
        });
      }
    }

    return appointments.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
