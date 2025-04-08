import { v4 as uuidv4 } from 'uuid';
import { 
  Patient, 
  Appointment, 
  MedicalRecord, 
  LabTest, 
  StaffMember,
  User,
  Medication
} from '@/types';
import { 
  createMockMedicalRecords, 
  createMockLabTests,
  createMockMedications
} from './mock-data-helpers';

// Mock data for patients
export const mockPatients: Patient[] = [
  {
    id: uuidv4(),
    fullName: "John Doe",
    dateOfBirth: "1985-05-15",
    gender: "male",
    contactPhone: "+233 55 123 4567",
    email: "john.doe@example.com",
    address: "123 Main Street, East Legon",
    nextOfKin: {
      name: "Jane Doe",
      relationship: "Spouse",
      contact: "+233 55 765 4321"
    },
    medicalHistory: "Hypertension, Type 2 Diabetes",
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20"
  },
  {
    id: uuidv4(),
    fullName: "Alice Smith",
    dateOfBirth: "1992-10-22",
    gender: "female",
    contactPhone: "+233 20 888 9999",
    email: "alice.smith@example.com",
    address: "456 Airport Road, Accra",
    nextOfKin: {
      name: "Bob Smith",
      relationship: "Brother",
      contact: "+233 20 111 2222"
    },
    medicalHistory: "Asthma, Allergies",
    createdAt: "2023-02-28",
    updatedAt: "2023-07-10"
  },
  {
    id: uuidv4(),
    fullName: "Kwame Nkrumah",
    dateOfBirth: "1978-03-06",
    gender: "male",
    contactPhone: "+233 24 333 4444",
    email: "kwame.nkrumah@example.com",
    address: "789 Liberation Avenue, Kumasi",
    nextOfKin: {
      name: "Ama Serwaa",
      relationship: "Sister",
      contact: "+233 24 555 6666"
    },
    medicalHistory: "None",
    createdAt: "2023-03-10",
    updatedAt: "2023-08-01"
  },
  {
    id: uuidv4(),
    fullName: "Akosua Mensah",
    dateOfBirth: "1989-11-18",
    gender: "female",
    contactPhone: "+233 50 999 0000",
    email: "akosua.mensah@example.com",
    address: "10 Independence Square, Accra",
    nextOfKin: {
      name: "Kofi Mensah",
      relationship: "Husband",
      contact: "+233 50 111 2222"
    },
    medicalHistory: "Anemia",
    createdAt: "2023-04-01",
    updatedAt: "2023-09-05"
  },
  {
    id: uuidv4(),
    fullName: "Yaw Boateng",
    dateOfBirth: "1965-07-29",
    gender: "male",
    contactPhone: "+233 54 777 8888",
    email: "yaw.boateng@example.com",
    address: "11 High Street, Cape Coast",
    nextOfKin: {
      name: "Abena Dapaah",
      relationship: "Wife",
      contact: "+233 54 333 4444"
    },
    medicalHistory: "Arthritis",
    createdAt: "2023-05-20",
    updatedAt: "2023-10-12"
  }
];

// Mock data for staff
export const mockStaff: StaffMember[] = [
  {
    id: uuidv4(),
    name: "Dr. Jescaps Antwi",
    role: "doctor",
    specialization: "General Medicine",
    contactPhone: "+233 55 111 2222",
    email: "jescaps.antwi@ashesi.edu.gh",
    schedule: {
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "8:00 AM - 4:00 PM",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 2:00 PM",
      saturday: "Off",
      sunday: "Off"
    }
  },
  {
    id: uuidv4(),
    name: "Nurse Emelia Thompson",
    role: "nurse",
    contactPhone: "+233 20 333 4444",
    email: "emelia.thompson@example.com",
    schedule: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 1:00 PM",
      saturday: "Off",
      sunday: "Off"
    }
  },
  {
    id: uuidv4(),
    name: "Dr. Kwame Owusu",
    role: "doctor",
    specialization: "Cardiology",
    contactPhone: "+233 24 888 9999",
    email: "kwame.owusu@example.com",
    schedule: {
      monday: "10:00 AM - 6:00 PM",
      tuesday: "10:00 AM - 6:00 PM",
      wednesday: "Off",
      thursday: "10:00 AM - 6:00 PM",
      friday: "10:00 AM - 3:00 PM",
      saturday: "Off",
      sunday: "Off"
    }
  },
  {
    id: uuidv4(),
    name: "Lab Tech Patricia Mensah",
    role: "lab_technician",
    contactPhone: "+233 50 555 6666",
    email: "patricia.mensah@example.com",
    schedule: {
      monday: "7:00 AM - 3:00 PM",
      tuesday: "7:00 AM - 3:00 PM",
      wednesday: "7:00 AM - 3:00 PM",
      thursday: "7:00 AM - 3:00 PM",
      friday: "7:00 AM - 12:00 PM",
      saturday: "Off",
      sunday: "Off"
    }
  },
  {
    id: uuidv4(),
    name: "Receptionist Abena Koomson",
    role: "receptionist",
    contactPhone: "+233 54 222 3333",
    email: "abena.koomson@example.com",
    schedule: {
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "8:00 AM - 4:00 PM",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 2:00 PM",
      saturday: "Off",
      sunday: "Off"
    }
  }
];

// Mock data for appointments
export const mockAppointments: Appointment[] = [
  {
    id: uuidv4(),
    patientId: mockPatients[0].id,
    patientName: mockPatients[0].fullName,
    doctorId: mockStaff[0].id,
    doctorName: mockStaff[0].name,
    date: "2023-09-15",
    time: "09:30",
    reason: "Follow-up appointment",
    status: "completed",
    notes: "Patient should bring previous test results"
  },
  {
    id: uuidv4(),
    patientId: mockPatients[1].id,
    patientName: mockPatients[1].fullName,
    doctorId: mockStaff[2].id,
    doctorName: mockStaff[2].name,
    date: "2023-09-16",
    time: "11:00",
    reason: "Initial consultation",
    status: "scheduled",
    notes: "New patient, gather detailed history"
  },
  {
    id: uuidv4(),
    patientId: mockPatients[2].id,
    patientName: mockPatients[2].fullName,
    doctorId: mockStaff[0].id,
    doctorName: mockStaff[0].name,
    date: "2023-09-17",
    time: "14:00",
    reason: "Check-up",
    status: "scheduled",
    notes: "Routine check-up, no specific complaints"
  },
  {
    id: uuidv4(),
    patientId: mockPatients[3].id,
    patientName: mockPatients[3].fullName,
    doctorId: mockStaff[2].id,
    doctorName: mockStaff[2].name,
    date: "2023-09-18",
    time: "10:00",
    reason: "ECG",
    status: "completed",
    notes: "Patient experienced chest pains"
  },
  {
    id: uuidv4(),
    patientId: mockPatients[4].id,
    patientName: mockPatients[4].fullName,
    doctorId: mockStaff[0].id,
    doctorName: mockStaff[0].name,
    date: "2023-09-19",
    time: "16:00",
    reason: "Physical therapy",
    status: "scheduled",
    notes: "Advised regular exercise"
  }
];

// Generate medical records, lab tests, and medications using the helper functions
const mockMedicalRecords: MedicalRecord[] = createMockMedicalRecords(mockPatients, mockStaff.filter(s => s.role === 'doctor'));
const mockLabTests: LabTest[] = createMockLabTests(mockPatients, mockStaff.filter(s => s.role === 'doctor'));
const mockMedications: Medication[] = createMockMedications();

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    name: "Admin User",
    email: "adobea.odame@ashesi.edu.gh",
    role: "admin",
    avatar: "/avatars/admin.png"
  },
  {
    id: uuidv4(),
    name: "Dr. Jescaps Antwi",
    email: "jescaps.antwi@ashesi.edu.gh",
    role: "doctor",
    avatar: "/avatars/doctor.png"
  },
  {
    id: uuidv4(),
    name: "Nurse Nanaakua Oduraa",
    email: "nanaakua.oduraa@ashesi.edu.gh",
    role: "nurse",
    avatar: "/avatars/nurse.png"
  },
  {
    id: uuidv4(),
    name: "Lab Tech Patricia Mensah",
    email: "patricia.mensah@example.com",
    role: "lab_technician",
    avatar: "/avatars/lab_tech.png"
  },
  {
    id: uuidv4(),
    name: "Receptionist Abena Koomson",
    email: "abena.koomson@example.com",
    role: "receptionist",
    avatar: "/avatars/receptionist.png"
  }
];

// Fetch functions
export const fetchPatients = async (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPatients);
    }, 500);
  });
};

export const fetchPatient = async (patientId: string): Promise<Patient | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === patientId);
      resolve(patient);
    }, 300);
  });
};

export const fetchStaff = async (): Promise<StaffMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStaff);
    }, 500);
  });
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAppointments);
    }, 500);
  });
};

export const fetchPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointments = mockAppointments.filter(a => a.patientId === patientId);
      resolve(appointments);
    }, 300);
  });
};

export const fetchMedicalRecords = async (): Promise<MedicalRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMedicalRecords);
    }, 500);
  });
};

export const fetchPatientMedicalRecords = async (patientId: string): Promise<MedicalRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = mockMedicalRecords.filter(r => r.patientId === patientId);
      resolve(records);
    }, 300);
  });
};

export const fetchLabTests = async (): Promise<LabTest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLabTests);
    }, 500);
  });
};

export const fetchLabTest = async (testId: string): Promise<LabTest | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const test = mockLabTests.find(t => t.id === testId);
      resolve(test);
    }, 300);
  });
};

export const fetchDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPatients: mockPatients.length,
        totalAppointments: mockAppointments.length,
        completedTests: mockLabTests.filter(t => t.status === "completed").length,
        pendingTests: mockLabTests.filter(t => t.status !== "completed").length,
        medicationAlerts: mockMedications.filter(m => m.currentStock < m.minimumStock).length,
      });
    }, 300);
  });
};

export const fetchMedications = async (): Promise<Medication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMedications);
    }, 500);
  });
};

// Add/Update functions
export const addPatient = async (patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString().split('T')[0];
      const newPatient: Patient = {
        id: uuidv4(),
        ...patientData,
        createdAt: now,
        updatedAt: now
      };
      mockPatients.push(newPatient);
      resolve(newPatient);
    }, 300);
  });
};

export const addAppointment = async (appointmentData: Omit<Appointment, "id">): Promise<Appointment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: uuidv4(),
        ...appointmentData
      };
      mockAppointments.push(newAppointment);
      resolve(newAppointment);
    }, 300);
  });
};

export const addMedicalRecord = async (recordData: Omit<MedicalRecord, "id">): Promise<MedicalRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord: MedicalRecord = {
        id: uuidv4(),
        ...recordData
      };
      mockMedicalRecords.push(newRecord);
      resolve(newRecord);
    }, 300);
  });
};

export const updateLabTest = async (testId: string, updates: Partial<LabTest>): Promise<LabTest> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const testIndex = mockLabTests.findIndex(test => test.id === testId);
      if (testIndex === -1) {
        reject(new Error("Lab test not found"));
        return;
      }
      
      const updatedTest = {
        ...mockLabTests[testIndex],
        ...updates
      };
      mockLabTests[testIndex] = updatedTest;
      resolve(updatedTest);
    }, 300);
  });
};

export const updateMedication = async (medicationId: string, updates: Partial<Medication>): Promise<Medication> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockMedications.findIndex(med => med.id === medicationId);
      if (index === -1) {
        reject(new Error("Medication not found"));
        return;
      }
      
      const updatedMedication = {
        ...mockMedications[index],
        ...updates
      };
      mockMedications[index] = updatedMedication;
      resolve(updatedMedication);
    }, 300);
  });
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }, 800);
  });
};
