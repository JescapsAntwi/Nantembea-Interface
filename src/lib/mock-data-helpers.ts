import { 
  Patient, 
  MedicalRecord, 
  LabTest, 
  Medication,
  StaffMember
} from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Create mock Medical Records
export function createMockMedicalRecords(patients: Patient[], doctors: StaffMember[]): MedicalRecord[] {
  const records: MedicalRecord[] = [];

  const symptoms = [
    "Fever, cough, and fatigue",
    "Headache and dizziness",
    "Shortness of breath",
    "Chest pain",
    "Abdominal pain",
    "Joint pain and stiffness",
    "Skin rash",
    "Nausea and vomiting"
  ];

  const diagnoses = [
    "Common cold",
    "Hypertension",
    "Type 2 diabetes",
    "Bronchitis",
    "Migraine",
    "Gastroenteritis",
    "Arthritis",
    "Urinary tract infection"
  ];

  const treatments = [
    "Rest and hydration",
    "Regular exercise and diet changes",
    "Blood pressure monitoring",
    "Regular blood glucose monitoring",
    "Physical therapy",
    "Avoid certain foods",
    "Apply topical cream",
    "Follow-up in 2 weeks"
  ];

  const medications = [
    ["Paracetamol - 500mg twice daily"],
    ["Ibuprofen - 400mg three times daily"],
    ["Amoxicillin - 250mg three times daily for 7 days"],
    ["Metformin - 500mg once daily"],
    ["Amlodipine - 5mg once daily"],
    ["Cetirizine - 10mg once daily"],
    ["Omeprazole - 20mg once daily before breakfast", "Paracetamol - 500mg as needed"]
  ];

  // Create 1-3 medical records for each patient
  patients.forEach((patient) => {
    const recordCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 records
    
    for (let i = 0; i < recordCount; i++) {
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      const symptomIndex = Math.floor(Math.random() * symptoms.length);
      const diagnosisIndex = Math.floor(Math.random() * diagnoses.length);
      const treatmentIndex = Math.floor(Math.random() * treatments.length);
      const medicationIndex = Math.floor(Math.random() * medications.length);
      
      // Random date in the past year
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      records.push({
        id: uuidv4(),
        patientId: patient.id,
        dateOfVisit: date.toISOString().split('T')[0],
        symptoms: symptoms[symptomIndex],
        diagnosis: diagnoses[diagnosisIndex],
        prescriptions: medications[medicationIndex],
        treatmentPlan: treatments[treatmentIndex],
        followUpInstructions: Math.random() > 0.5 ? "Follow up in 2 weeks" : "",
        attendingDoctorId: randomDoctor.id,
        attendingDoctorName: randomDoctor.name
      });
    }
  });

  return records;
}

// Create mock Lab Tests
export function createMockLabTests(patients: Patient[], doctors: StaffMember[]): LabTest[] {
  const tests: LabTest[] = [];
  
  const testTypes = [
    "blood_test",
    "urine_analysis",
    "x_ray",
    "mri",
    "ct_scan",
    "ultrasound",
    "ecg"
  ];
  
  const statuses: Array<"requested" | "in_progress" | "completed"> = ["requested", "in_progress", "completed"];
  const resultTemplates = [
    "All values within normal range.",
    "Slightly elevated white blood cell count, suggesting possible infection.",
    "Abnormal readings detected, recommend follow-up examination.",
    "Results indicate need for additional specialized testing.",
    "Test completed successfully, no abnormalities detected."
  ];
  
  // Create lab tests for about 70% of patients
  patients.forEach((patient) => {
    if (Math.random() < 0.7) {
      const testCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 tests per patient
      
      for (let i = 0; i < testCount; i++) {
        const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as "requested" | "in_progress" | "completed";
        
        // Random date in the past 30 days
        const requestDate = new Date();
        requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 30));
        
        let resultDate = null;
        let results = null;
        
        if (status === "completed") {
          resultDate = new Date(requestDate);
          resultDate.setDate(resultDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after request
          results = resultTemplates[Math.floor(Math.random() * resultTemplates.length)];
        }
        
        tests.push({
          id: uuidv4(),
          patientId: patient.id,
          patientName: patient.fullName,
          requestedBy: randomDoctor.name,
          testType: testType,
          requestDate: requestDate.toISOString().split('T')[0],
          status: status,
          results: results,
          resultDate: resultDate ? resultDate.toISOString().split('T')[0] : undefined
        });
      }
    }
  });
  
  return tests;
}

// Create mock Medications
export function createMockMedications(): Medication[] {
  const medications: Medication[] = [
    {
      id: uuidv4(),
      name: "Paracetamol",
      dosage: "500mg tablets",
      currentStock: 350,
      minimumStock: 100,
      expiryDate: "2025-12-15"
    },
    {
      id: uuidv4(),
      name: "Ibuprofen",
      dosage: "400mg tablets",
      currentStock: 120,
      minimumStock: 100,
      expiryDate: "2025-08-20"
    },
    {
      id: uuidv4(),
      name: "Amoxicillin",
      dosage: "250mg capsules",
      currentStock: 80,
      minimumStock: 100,
      expiryDate: "2025-05-10"
    },
    {
      id: uuidv4(),
      name: "Metformin",
      dosage: "500mg tablets",
      currentStock: 200,
      minimumStock: 150,
      expiryDate: "2026-02-28"
    },
    {
      id: uuidv4(),
      name: "Amlodipine",
      dosage: "5mg tablets",
      currentStock: 60,
      minimumStock: 75,
      expiryDate: "2025-09-10"
    },
    {
      id: uuidv4(),
      name: "Cetirizine",
      dosage: "10mg tablets",
      currentStock: 130,
      minimumStock: 80,
      expiryDate: "2025-07-22"
    },
    {
      id: uuidv4(),
      name: "Omeprazole",
      dosage: "20mg capsules",
      currentStock: 95,
      minimumStock: 100,
      expiryDate: "2025-11-15"
    },
    {
      id: uuidv4(),
      name: "Salbutamol",
      dosage: "100mcg inhaler",
      currentStock: 25,
      minimumStock: 30,
      expiryDate: "2025-06-18"
    },
    {
      id: uuidv4(),
      name: "Metoprolol",
      dosage: "50mg tablets",
      currentStock: 180,
      minimumStock: 100,
      expiryDate: "2026-03-25"
    },
    {
      id: uuidv4(),
      name: "Lisinopril",
      dosage: "10mg tablets",
      currentStock: 40,
      minimumStock: 50,
      expiryDate: "2025-08-05"
    }
  ];
  
  return medications;
}
