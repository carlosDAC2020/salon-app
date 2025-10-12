import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';
import { Client } from '../../core/models/client.model';
import { Employee } from '../../core/models/employee.model';
import { Service } from '../../core/models/service.model';
import { AppointmentsService } from '../../core/services/appointments.service';
import { ClientsService } from '../../core/services/clients.service';
import { EmployeesService } from '../../core/services/employees.service';
import { ServicesService } from '../../core/services/services.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  clients: Client[] = [];
  employees: Employee[] = [];
  services: Service[] = [];
  
  searchTerm: string = '';
  filterStatus: string = 'all';
  filterDate: string = '';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentAppointment: Partial<Appointment> = this.getEmptyAppointment();
  
  AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentsService: AppointmentsService,
    private clientsService: ClientsService,
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadClients();
    this.loadEmployees();
    this.loadServices();
  }

  loadAppointments(): void {
    this.appointments = this.appointmentsService.getAll();
    this.applyFilters();
  }

  loadClients(): void {
    this.clients = this.clientsService.getActive();
  }

  loadEmployees(): void {
    this.employees = this.employeesService.getActive();
  }

  loadServices(): void {
    this.services = this.servicesService.getAll();
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = 
        appointment.clientName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.employeeName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.serviceName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = 
        this.filterStatus === 'all' || appointment.status === this.filterStatus;
      
      const matchesDate = !this.filterDate || 
        new Date(appointment.date).toDateString() === new Date(this.filterDate).toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentAppointment = this.getEmptyAppointment();
    this.showModal = true;
  }

  openEditModal(appointment: Appointment): void {
    this.isEditMode = true;
    this.currentAppointment = { 
      ...appointment,
      date: new Date(appointment.date)
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentAppointment = this.getEmptyAppointment();
  }

  saveAppointment(): void {
    // Obtener información adicional
    const client = this.clients.find(c => c.id === this.currentAppointment.clientId);
    const employee = this.employees.find(e => e.id === this.currentAppointment.employeeId);
    const service = this.services.find(s => s.id === this.currentAppointment.serviceId);

    if (client && employee && service) {
      this.currentAppointment.clientName = `${client.firstName} ${client.lastName}`;
      this.currentAppointment.employeeName = `${employee.firstName} ${employee.lastName}`;
      this.currentAppointment.serviceName = service.name;
      this.currentAppointment.price = service.price;
      
      // Calcular endTime basado en la duración del servicio
      const [hours, minutes] = this.currentAppointment.startTime!.split(':').map(Number);
      const endMinutes = hours * 60 + minutes + service.duration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      this.currentAppointment.endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    }

    if (this.isEditMode && this.currentAppointment.id) {
      this.appointmentsService.update(this.currentAppointment.id, this.currentAppointment);
    } else {
      this.appointmentsService.create(this.currentAppointment as Omit<Appointment, 'id' | 'createdAt'>);
    }
    
    this.loadAppointments();
    this.closeModal();
  }

  deleteAppointment(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.appointmentsService.delete(id);
      this.loadAppointments();
    }
  }

  updateStatus(id: string, status: AppointmentStatus): void {
    this.appointmentsService.updateStatus(id, status);
    this.loadAppointments();
  }

  getStatusInfo(status: AppointmentStatus) {
    return this.appointmentsService.getStatusInfo(status);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const appointmentDate = new Date(date);
    return today.toDateString() === appointmentDate.toDateString();
  }

  isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  }

  private getEmptyAppointment(): Partial<Appointment> {
    const today = new Date();
    return {
      clientId: '',
      employeeId: '',
      serviceId: '',
      date: today,
      startTime: '09:00',
      status: AppointmentStatus.PENDING,
      notes: ''
    };
  }
}

