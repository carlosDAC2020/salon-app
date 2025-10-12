import { Injectable } from '@angular/core';
import { Service, ServiceCategory } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private services: Service[] = [
    {
      id: '1',
      name: 'Corte de Cabello',
      description: 'Corte de cabello profesional con estilo personalizado',
      duration: 30,
      price: 25000,
      category: 'Cabello',
      isActive: true
    },
    {
      id: '2',
      name: 'Tinte Completo',
      description: 'Coloración completa del cabello con productos de alta calidad',
      duration: 120,
      price: 80000,
      category: 'Cabello',
      isActive: true
    },
    {
      id: '3',
      name: 'Mechas',
      description: 'Mechas californianas o balayage',
      duration: 150,
      price: 120000,
      category: 'Cabello',
      isActive: true
    },
    {
      id: '4',
      name: 'Alisado Permanente',
      description: 'Alisado con keratina de larga duración',
      duration: 180,
      price: 200000,
      category: 'Cabello',
      isActive: true
    },
    {
      id: '5',
      name: 'Peinado Especial',
      description: 'Peinado para eventos y ocasiones especiales',
      duration: 60,
      price: 45000,
      category: 'Cabello',
      isActive: true
    },
    {
      id: '6',
      name: 'Manicure',
      description: 'Cuidado completo de uñas de manos',
      duration: 45,
      price: 30000,
      category: 'Uñas',
      isActive: true
    },
    {
      id: '7',
      name: 'Pedicure',
      description: 'Cuidado completo de uñas de pies',
      duration: 60,
      price: 35000,
      category: 'Uñas',
      isActive: true
    },
    {
      id: '8',
      name: 'Uñas Acrílicas',
      description: 'Aplicación de uñas acrílicas con diseño',
      duration: 90,
      price: 50000,
      category: 'Uñas',
      isActive: true
    },
    {
      id: '9',
      name: 'Uñas en Gel',
      description: 'Aplicación de uñas en gel semipermanente',
      duration: 75,
      price: 45000,
      category: 'Uñas',
      isActive: true
    },
    {
      id: '10',
      name: 'Tratamiento Facial',
      description: 'Limpieza facial profunda e hidratación',
      duration: 90,
      price: 60000,
      category: 'Facial',
      isActive: true
    },
    {
      id: '11',
      name: 'Masaje Facial',
      description: 'Masaje relajante facial con productos naturales',
      duration: 45,
      price: 40000,
      category: 'Facial',
      isActive: true
    },
    {
      id: '12',
      name: 'Depilación Facial',
      description: 'Depilación con cera de rostro completo',
      duration: 30,
      price: 25000,
      category: 'Facial',
      isActive: true
    },
    {
      id: '13',
      name: 'Maquillaje Social',
      description: 'Maquillaje profesional para eventos',
      duration: 60,
      price: 70000,
      category: 'Maquillaje',
      isActive: true
    },
    {
      id: '14',
      name: 'Maquillaje de Novia',
      description: 'Maquillaje especial para novias con prueba',
      duration: 120,
      price: 150000,
      category: 'Maquillaje',
      isActive: true
    },
    {
      id: '15',
      name: 'Masaje Relajante',
      description: 'Masaje corporal relajante de 60 minutos',
      duration: 60,
      price: 80000,
      category: 'Masajes',
      isActive: true
    },
    {
      id: '16',
      name: 'Masaje Descontracturante',
      description: 'Masaje terapéutico para aliviar tensiones',
      duration: 90,
      price: 100000,
      category: 'Masajes',
      isActive: true
    }
  ];

  private categories: ServiceCategory[] = [
    { id: '1', name: 'Cabello', icon: 'content_cut' },
    { id: '2', name: 'Uñas', icon: 'brush' },
    { id: '3', name: 'Facial', icon: 'face' },
    { id: '4', name: 'Maquillaje', icon: 'palette' },
    { id: '5', name: 'Masajes', icon: 'spa' },
    { id: '6', name: 'Todos', icon: 'apps' }
  ];

  getAll(): Service[] {
    return [...this.services];
  }

  getById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  getCategories(): ServiceCategory[] {
    return [...this.categories];
  }

  create(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return newService;
  }

  update(id: string, service: Partial<Service>): Service | undefined {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services[index] = {
        ...this.services[index],
        ...service,
        updatedAt: new Date()
      };
      return this.services[index];
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services.splice(index, 1);
      return true;
    }
    return false;
  }

  toggleActive(id: string): Service | undefined {
    const service = this.services.find(s => s.id === id);
    if (service) {
      service.isActive = !service.isActive;
      service.updatedAt = new Date();
      return service;
    }
    return undefined;
  }
}
