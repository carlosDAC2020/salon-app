import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service, ServiceCategory } from '../../core/models/service.model';
import { ServicesService } from '../../core/services/services.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  categories: ServiceCategory[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = 'all';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentService: Partial<Service> = this.getEmptyService();

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadCategories();
  }

  loadServices(): void {
    this.services = this.servicesService.getAll();
    this.applyFilters();
  }

  loadCategories(): void {
    this.categories = this.servicesService.getCategories();
  }

  applyFilters(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || service.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentService = this.getEmptyService();
    this.showModal = true;
  }

  openEditModal(service: Service): void {
    this.isEditMode = true;
    this.currentService = { ...service };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentService = this.getEmptyService();
  }

  saveService(): void {
    if (this.isEditMode && this.currentService.id) {
      this.servicesService.update(this.currentService.id, this.currentService);
    } else {
      this.servicesService.create(this.currentService as Omit<Service, 'id'>);
    }
    this.loadServices();
    this.closeModal();
  }

  deleteService(id: string): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicesService.delete(id);
      this.loadServices();
    }
  }

  toggleServiceStatus(id: string): void {
    this.servicesService.toggleActive(id);
    this.loadServices();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Cabello': 'content_cut',
      'Uñas': 'brush',
      'Facial': 'face',
      'Maquillaje': 'palette',
      'Masajes': 'spa'
    };
    return iconMap[category] || 'spa';
  }

  private getEmptyService(): Partial<Service> {
    return {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      category: '',
      isActive: true
    };
  }
}
