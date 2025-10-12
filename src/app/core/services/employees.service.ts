import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private employees: Employee[] = [
    {
      id: '1',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@salon.com',
      phone: '3001234567',
      position: 'Estilista Senior',
      specialties: ['1', '2', '3', '5'],
      isActive: true,
      hireDate: new Date('2022-01-15'),
      photoUrl: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Ramírez',
      email: 'carlos.ramirez@salon.com',
      phone: '3009876543',
      position: 'Barbero',
      specialties: ['1', '5'],
      isActive: true,
      hireDate: new Date('2021-06-20'),
      photoUrl: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@salon.com',
      phone: '3005551234',
      position: 'Manicurista',
      specialties: ['6', '7', '8', '9'],
      isActive: true,
      hireDate: new Date('2023-03-10'),
      photoUrl: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: '4',
      firstName: 'Luis',
      lastName: 'Torres',
      email: 'luis.torres@salon.com',
      phone: '3007778888',
      position: 'Colorista',
      specialties: ['2', '3', '4'],
      isActive: true,
      hireDate: new Date('2020-11-05'),
      photoUrl: 'https://i.pravatar.cc/150?img=13'
    },
    {
      id: '5',
      firstName: 'Patricia',
      lastName: 'Sánchez',
      email: 'patricia.sanchez@salon.com',
      phone: '3012345678',
      position: 'Esteticista',
      specialties: ['10', '11', '12'],
      isActive: true,
      hireDate: new Date('2022-08-12'),
      photoUrl: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: '6',
      firstName: 'Diego',
      lastName: 'Fernández',
      email: 'diego.fernandez@salon.com',
      phone: '3019876543',
      position: 'Masajista',
      specialties: ['15', '16'],
      isActive: true,
      hireDate: new Date('2023-01-20'),
      photoUrl: 'https://i.pravatar.cc/150?img=14'
    },
    {
      id: '7',
      firstName: 'Valentina',
      lastName: 'López',
      email: 'valentina.lopez@salon.com',
      phone: '3025556789',
      position: 'Maquilladora',
      specialties: ['13', '14'],
      isActive: true,
      hireDate: new Date('2022-05-15'),
      photoUrl: 'https://i.pravatar.cc/150?img=10'
    },
    {
      id: '8',
      firstName: 'Andrés',
      lastName: 'Moreno',
      email: 'andres.moreno@salon.com',
      phone: '3034567890',
      position: 'Estilista',
      specialties: ['1', '2', '5'],
      isActive: true,
      hireDate: new Date('2023-06-01'),
      photoUrl: 'https://i.pravatar.cc/150?img=15'
    },
    {
      id: '9',
      firstName: 'Carolina',
      lastName: 'Vargas',
      email: 'carolina.vargas@salon.com',
      phone: '3045678901',
      position: 'Especialista en Uñas',
      specialties: ['6', '7', '8', '9'],
      isActive: true,
      hireDate: new Date('2021-09-10'),
      photoUrl: 'https://i.pravatar.cc/150?img=20'
    },
    {
      id: '10',
      firstName: 'Roberto',
      lastName: 'Castro',
      email: 'roberto.castro@salon.com',
      phone: '3056789012',
      position: 'Colorista Senior',
      specialties: ['2', '3', '4'],
      isActive: true,
      hireDate: new Date('2020-03-25'),
      photoUrl: 'https://i.pravatar.cc/150?img=18'
    }
  ];

  getAll(): Employee[] {
    return [...this.employees];
  }

  getActive(): Employee[] {
    return this.employees.filter(e => e.isActive);
  }

  getById(id: string): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  create(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString()
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  update(id: string, employee: Partial<Employee>): Employee | undefined {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = {
        ...this.employees[index],
        ...employee
      };
      return this.employees[index];
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return true;
    }
    return false;
  }

  toggleActive(id: string): Employee | undefined {
    const employee = this.employees.find(e => e.id === id);
    if (employee) {
      employee.isActive = !employee.isActive;
      return employee;
    }
    return undefined;
  }
}
