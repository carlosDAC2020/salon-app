import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../core/models/employee.model';
import { Service } from '../../core/models/service.model';
import { EmployeesService } from '../../core/services/employees.service';
import { ServicesService } from '../../core/services/services.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  availableServices: Service[] = [];
  
  searchTerm: string = '';
  filterStatus: string = 'all';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentEmployee: Partial<Employee> = this.getEmptyEmployee();

  constructor(
    private employeesService: EmployeesService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadServices();
  }

  loadEmployees(): void {
    this.employees = this.employeesService.getAll();
    this.applyFilters();
  }

  loadServices(): void {
    this.availableServices = this.servicesService.getAll();
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = 
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && employee.isActive) ||
        (this.filterStatus === 'inactive' && !employee.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentEmployee = this.getEmptyEmployee();
    this.showModal = true;
  }

  openEditModal(employee: Employee): void {
    this.isEditMode = true;
    this.currentEmployee = { ...employee, specialties: [...employee.specialties] };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEmployee = this.getEmptyEmployee();
  }

  saveEmployee(): void {
    if (this.isEditMode && this.currentEmployee.id) {
      this.employeesService.update(this.currentEmployee.id, this.currentEmployee);
    } else {
      this.employeesService.create(this.currentEmployee as Omit<Employee, 'id'>);
    }
    this.loadEmployees();
    this.closeModal();
  }

  deleteEmployee(id: string): void {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.employeesService.delete(id);
      this.loadEmployees();
    }
  }

  toggleEmployeeStatus(id: string): void {
    this.employeesService.toggleActive(id);
    this.loadEmployees();
  }

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  getServiceNames(specialtyIds: string[]): string {
    return specialtyIds
      .map(id => this.availableServices.find(s => s.id === id)?.name)
      .filter(name => name)
      .join(', ') || 'Sin especialidades';
  }

  toggleSpecialty(serviceId: string): void {
    if (!this.currentEmployee.specialties) {
      this.currentEmployee.specialties = [];
    }
    
    const index = this.currentEmployee.specialties.indexOf(serviceId);
    if (index > -1) {
      this.currentEmployee.specialties.splice(index, 1);
    } else {
      this.currentEmployee.specialties.push(serviceId);
    }
  }

  isSpecialtySelected(serviceId: string): boolean {
    return this.currentEmployee.specialties?.includes(serviceId) || false;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getYearsOfService(hireDate: Date): number {
    const years = (new Date().getTime() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(years);
  }

  private getEmptyEmployee(): Partial<Employee> {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      specialties: [],
      isActive: true,
      hireDate: new Date(),
      photoUrl: ''
    };
  }
}

