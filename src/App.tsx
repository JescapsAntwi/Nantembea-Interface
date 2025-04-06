
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFound";
import PatientsPage from "./pages/Patients";
import NewPatientPage from "./pages/NewPatient";
import AppointmentsPage from "./pages/Appointments";
import MedicationsPage from "./pages/Medications";
import LabTestsPage from "./pages/LabTests";
import LabTestResultsPage from "./pages/LabTestResults";
import PatientDetailPage from "./pages/PatientDetail";
import NewMedicalRecordPage from "./pages/NewMedicalRecord";
import ReportsPage from "./pages/Reports";
import { fetchPatients, fetchStaff } from "./lib/mock-data";
import { Patient, StaffMember } from "./types";

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const patientsData = await fetchPatients();
        const staffData = await fetchStaff();
        const doctorsData = staffData.filter(staff => staff.role === 'doctor');
        
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (isLoading) {
    return <div>Loading application data...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect from root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="patients">
          <Route index element={<PatientsPage />} />
          <Route path="new" element={<NewPatientPage />} />
          <Route path=":id" element={<PatientDetailPage />} />
        </Route>
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route 
          path="medical-records/new/:patientId" 
          element={<NewMedicalRecordPage patients={patients} doctors={doctors} />} 
        />
        <Route path="lab-tests">
          <Route index element={<LabTestsPage />} />
          <Route path=":id/results" element={<LabTestResultsPage />} />
        </Route>
        <Route path="medications" element={<MedicationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;