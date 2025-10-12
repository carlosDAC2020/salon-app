import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private clients: Client[] = [
    {
      id: '1',
      firstName: 'Laura',
      lastName: 'Pérez',
      email: 'laura.perez@email.com',
      phone: '3101234567',
      isActive: true,
      registeredAt: new Date('2023-01-15'),
      lastVisit: new Date('2024-10-08'),
      totalVisits: 24,
      totalSpent: 1250000,
      preferences: {
        preferredEmployee: '1',
        preferredServices: ['1', '2', '3']
      }
    },
    {
      id: '2',
      firstName: 'Roberto',
      lastName: 'Gómez',
      email: 'roberto.gomez@email.com',
      phone: '3209876543',
      birthDate: new Date('1985-05-20'),
      isActive: true,
      registeredAt: new Date('2023-03-10'),
      lastVisit: new Date('2024-10-05'),
      totalVisits: 18,
      totalSpent: 520000
    },
    {
      id: '3',
      firstName: 'Sofía',
      lastName: 'Rodríguez',
      email: 'sofia.rodriguez@email.com',
      phone: '3005551234',
      address: 'Calle 123 #45-67',
      isActive: true,
      registeredAt: new Date('2023-06-20'),
      lastVisit: new Date('2024-10-10'),
      totalVisits: 32,
      totalSpent: 1680000,
      preferences: {
        preferredEmployee: '2',
        allergies: ['Tinte con amoníaco']
      }
    },
    {
      id: '4',
      firstName: 'Miguel',
      lastName: 'Hernández',
      email: 'miguel.hernandez@email.com',
      phone: '3157778888',
      isActive: true,
      registeredAt: new Date('2022-11-05'),
      lastVisit: new Date('2024-09-15'),
      totalVisits: 15,
      totalSpent: 450000
    },
    {
      id: '5',
      firstName: 'Isabella',
      lastName: 'Martínez',
      email: 'isabella.martinez@email.com',
      phone: '3112223344',
      isActive: true,
      registeredAt: new Date('2023-02-20'),
      lastVisit: new Date('2024-10-11'),
      totalVisits: 28,
      totalSpent: 980000
    },
    {
      id: '6',
      firstName: 'Camila',
      lastName: 'García',
      email: 'camila.garcia@email.com',
      phone: '3123334455',
      isActive: true,
      registeredAt: new Date('2023-04-15'),
      lastVisit: new Date('2024-10-09'),
      totalVisits: 22,
      totalSpent: 750000
    },
    {
      id: '7',
      firstName: 'Sebastián',
      lastName: 'López',
      email: 'sebastian.lopez@email.com',
      phone: '3134445566',
      isActive: true,
      registeredAt: new Date('2023-05-10'),
      lastVisit: new Date('2024-10-07'),
      totalVisits: 16,
      totalSpent: 420000
    },
    {
      id: '8',
      firstName: 'Valentina',
      lastName: 'Díaz',
      email: 'valentina.diaz@email.com',
      phone: '3145556677',
      isActive: true,
      registeredAt: new Date('2023-07-25'),
      lastVisit: new Date('2024-10-12'),
      totalVisits: 19,
      totalSpent: 680000
    },
    {
      id: '9',
      firstName: 'Mateo',
      lastName: 'Ramírez',
      email: 'mateo.ramirez@email.com',
      phone: '3156667788',
      isActive: true,
      registeredAt: new Date('2023-08-30'),
      lastVisit: new Date('2024-10-06'),
      totalVisits: 14,
      totalSpent: 380000
    },
    {
      id: '10',
      firstName: 'Mariana',
      lastName: 'Torres',
      email: 'mariana.torres@email.com',
      phone: '3167778899',
      isActive: true,
      registeredAt: new Date('2023-09-12'),
      lastVisit: new Date('2024-10-11'),
      totalVisits: 26,
      totalSpent: 920000
    },
    {
      id: '11',
      firstName: 'Daniel',
      lastName: 'Flores',
      email: 'daniel.flores@email.com',
      phone: '3178889900',
      isActive: true,
      registeredAt: new Date('2023-10-05'),
      lastVisit: new Date('2024-10-08'),
      totalVisits: 12,
      totalSpent: 340000
    },
    {
      id: '12',
      firstName: 'Lucía',
      lastName: 'Morales',
      email: 'lucia.morales@email.com',
      phone: '3189990011',
      isActive: true,
      registeredAt: new Date('2023-11-18'),
      lastVisit: new Date('2024-10-10'),
      totalVisits: 20,
      totalSpent: 720000
    },
    {
      id: '13',
      firstName: 'Santiago',
      lastName: 'Vargas',
      email: 'santiago.vargas@email.com',
      phone: '3190001122',
      isActive: true,
      registeredAt: new Date('2023-12-22'),
      lastVisit: new Date('2024-10-09'),
      totalVisits: 11,
      totalSpent: 310000
    },
    {
      id: '14',
      firstName: 'Gabriela',
      lastName: 'Castro',
      email: 'gabriela.castro@email.com',
      phone: '3201112233',
      isActive: true,
      registeredAt: new Date('2024-01-14'),
      lastVisit: new Date('2024-10-12'),
      totalVisits: 18,
      totalSpent: 620000
    },
    {
      id: '15',
      firstName: 'Nicolás',
      lastName: 'Ortiz',
      email: 'nicolas.ortiz@email.com',
      phone: '3212223344',
      isActive: true,
      registeredAt: new Date('2024-02-08'),
      lastVisit: new Date('2024-10-07'),
      totalVisits: 13,
      totalSpent: 370000
    },
    {
      id: '16',
      firstName: 'Paula',
      lastName: 'Mendoza',
      email: 'paula.mendoza@email.com',
      phone: '3223334455',
      isActive: true,
      registeredAt: new Date('2024-03-19'),
      lastVisit: new Date('2024-10-11'),
      totalVisits: 15,
      totalSpent: 540000
    },
    {
      id: '17',
      firstName: 'Andrés',
      lastName: 'Silva',
      email: 'andres.silva@email.com',
      phone: '3234445566',
      isActive: true,
      registeredAt: new Date('2024-04-25'),
      lastVisit: new Date('2024-10-08'),
      totalVisits: 10,
      totalSpent: 280000
    },
    {
      id: '18',
      firstName: 'Carolina',
      lastName: 'Reyes',
      email: 'carolina.reyes@email.com',
      phone: '3245556677',
      isActive: true,
      registeredAt: new Date('2024-05-30'),
      lastVisit: new Date('2024-10-10'),
      totalVisits: 12,
      totalSpent: 420000
    },
    {
      id: '19',
      firstName: 'Felipe',
      lastName: 'Gutiérrez',
      email: 'felipe.gutierrez@email.com',
      phone: '3256667788',
      isActive: true,
      registeredAt: new Date('2024-06-15'),
      lastVisit: new Date('2024-10-09'),
      totalVisits: 9,
      totalSpent: 250000
    },
    {
      id: '20',
      firstName: 'Natalia',
      lastName: 'Jiménez',
      email: 'natalia.jimenez@email.com',
      phone: '3267778899',
      isActive: true,
      registeredAt: new Date('2024-07-20'),
      lastVisit: new Date('2024-10-12'),
      totalVisits: 8,
      totalSpent: 290000
    }
  ];

  getAll(): Client[] {
    return [...this.clients];
  }

  getActive(): Client[] {
    return this.clients.filter(c => c.isActive);
  }

  getById(id: string): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  create(client: Omit<Client, 'id' | 'registeredAt' | 'totalVisits' | 'totalSpent'>): Client {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      registeredAt: new Date(),
      totalVisits: 0,
      totalSpent: 0
    };
    this.clients.push(newClient);
    return newClient;
  }

  update(id: string, client: Partial<Client>): Client | undefined {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = {
        ...this.clients[index],
        ...client
      };
      return this.clients[index];
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients.splice(index, 1);
      return true;
    }
    return false;
  }

  toggleActive(id: string): Client | undefined {
    const client = this.clients.find(c => c.id === id);
    if (client) {
      client.isActive = !client.isActive;
      return client;
    }
    return undefined;
  }

  searchClients(term: string): Client[] {
    const lowerTerm = term.toLowerCase();
    return this.clients.filter(c =>
      c.firstName.toLowerCase().includes(lowerTerm) ||
      c.lastName.toLowerCase().includes(lowerTerm) ||
      c.email.toLowerCase().includes(lowerTerm) ||
      c.phone.includes(term)
    );
  }
}
