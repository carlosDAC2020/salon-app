import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../core/models/client.model';
import { ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  
  searchTerm: string = '';
  filterStatus: string = 'all';
  sortBy: string = 'name';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentClient: Partial<Client> = this.getEmptyClient();

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clients = this.clientsService.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.clients.filter(client => {
      const matchesSearch = 
        client.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone.includes(this.searchTerm);
      
      const matchesStatus = 
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && client.isActive) ||
        (this.filterStatus === 'inactive' && !client.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Aplicar ordenamiento
    filtered = this.sortClients(filtered);
    this.filteredClients = filtered;
  }

  sortClients(clients: Client[]): Client[] {
    return clients.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'visits':
          return b.totalVisits - a.totalVisits;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'recent':
          const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentClient = this.getEmptyClient();
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.isEditMode = true;
    this.currentClient = { ...client };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentClient = this.getEmptyClient();
  }

  saveClient(): void {
    if (this.isEditMode && this.currentClient.id) {
      this.clientsService.update(this.currentClient.id, this.currentClient);
    } else {
      this.clientsService.create(this.currentClient as Omit<Client, 'id' | 'registeredAt' | 'totalVisits' | 'totalSpent'>);
    }
    this.loadClients();
    this.closeModal();
  }

  deleteClient(id: string): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientsService.delete(id);
      this.loadClients();
    }
  }

  toggleClientStatus(id: string): void {
    this.clientsService.toggleActive(id);
    this.loadClients();
  }

  getFullName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getClientSince(date: Date): string {
    const months = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (months < 12) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }

  private getEmptyClient(): Partial<Client> {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: undefined,
      address: '',
      notes: '',
      isActive: true
    };
  }
}

