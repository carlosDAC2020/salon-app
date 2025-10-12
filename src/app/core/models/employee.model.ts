export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  specialties: string[]; // IDs de servicios
  isActive: boolean;
  hireDate: Date;
  photoUrl?: string;
  schedule?: EmployeeSchedule;
}

export interface EmployeeSchedule {
  [key: string]: { // 'monday', 'tuesday', etc.
    isWorking: boolean;
    startTime: string; // "09:00"
    endTime: string; // "18:00"
  };
}
