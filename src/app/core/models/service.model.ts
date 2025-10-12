export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  category: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}
