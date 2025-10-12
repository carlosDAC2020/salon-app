export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: Date;
  address?: string;
  notes?: string;
  isActive: boolean;
  registeredAt: Date;
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
  preferences?: ClientPreferences;
}

export interface ClientPreferences {
  preferredEmployee?: string;
  preferredServices?: string[];
  allergies?: string[];
  notes?: string;
}
