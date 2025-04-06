export type Gender = 'male' | 'female' | 'other';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'lab_technician' | 'receptionist';
  avatar?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  contactPhone: string;
  email?: string;
  address: string;
  nextOfKin: {
    name: string;
    relationship: string;
    contact: string;
  };
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  dateOfVisit: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string[];
  treatmentPlan: string;
  followUpInstructions?: string;
  attendingDoctorId: string;
  attendingDoctorName: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  currentStock: number;
  minimumStock: number;
  expiryDate: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  requestedBy: string;
  testType: string;
  requestDate: string;
  status: 'requested' | 'in_progress' | 'completed';
  results?: string;
  resultDate?: string;
  comments?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'lab_technician' | 'receptionist' | 'admin';
  specialization?: string;
  contactPhone: string;
  email: string;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  referredTo: string;
  referredBy: string;
  reason: string;
  date: string;
  status: 'pending' | 'completed';
  notes?: string;
}

export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  coordinator: string;
  participantsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  status: 'operational' | 'maintenance_required' | 'out_of_service';
}

export interface DashboardStats {
  totalPatients: number;
  appointmentsToday: number;
  pendingLabTests: number;
  lowStockMedications: number;
  upcomingHealthPrograms: number;
}
