export interface Appointment {
  id: string;
  clientId: string;
  clientName?: string;
  employeeId: string;
  employeeName?: string;
  serviceId: string;
  serviceName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface AppointmentStatusInfo {
  value: AppointmentStatus;
  label: string;
  color: string;
  icon: string;
}
