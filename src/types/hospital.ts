export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  licenseNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  hospitalId: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  departmentId: string;
  hospitalId: string;
  consultationDuration: number; // in minutes
  profileImage?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  hospitalCity?: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  bookedBy?: string;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  bookedAt?: string; // ISO date string
  appointmentType?: 'In-person' | 'Video';
}

export interface OPTiming {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isActive: boolean;
}
