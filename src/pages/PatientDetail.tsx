
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, ClipboardList } from 'lucide-react';
import { fetchPatient, fetchPatientAppointments, fetchPatientMedicalRecords } from '@/lib/mock-data';
import { Patient, Appointment, MedicalRecord } from '@/types';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatientData = async () => {
      if (!id) return;

      try {
        const [patientData, appointmentsData, medicalRecordsData] = await Promise.all([
          fetchPatient(id),
          fetchPatientAppointments(id),
          fetchPatientMedicalRecords(id)
        ]);

        if (patientData) {
          setPatient(patientData);
          setAppointments(appointmentsData || []);
          setMedicalRecords(medicalRecordsData || []);
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientData();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case "rescheduled":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-6">Loading patient information...</div>;
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
          <Button asChild>
            <Link to="/patients">Back to Patients</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{patient.fullName}</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to={`/medical-records/new/${patient.id}`}><FileText className="mr-2 h-4 w-4" /> Add Medical Record</Link>
          </Button>
          <Button asChild>
            <Link to="/appointments"><CalendarDays className="mr-2 h-4 w-4" /> Schedule Appointment</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p>{patient.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p className="capitalize">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p>{patient.contactPhone}</p>
              {patient.email && <p>{patient.email}</p>}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{patient.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next of Kin</p>
              <p>{patient.nextOfKin.name} ({patient.nextOfKin.relationship})</p>
              <p>{patient.nextOfKin.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patient Since</p>
              <p>{new Date(patient.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="medical-history" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="medical-history">
                <FileText className="mr-2 h-4 w-4" /> Medical History
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <CalendarDays className="mr-2 h-4 w-4" /> Appointments
              </TabsTrigger>
              <TabsTrigger value="medical-records">
                <ClipboardList className="mr-2 h-4 w-4" /> Medical Records
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="medical-history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{patient.medicalHistory || "No medical history recorded."}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border-b pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{appointment.reason}</h3>
                              <p className="text-sm text-muted-foreground">With Dr. {appointment.doctorName}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{appointment.date}</p>
                                <p>{getStatusBadge(appointment.status)}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{appointment.time}</p>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="mt-2 text-sm">{appointment.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No appointments found for this patient.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medical-records" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <div key={record.id} className="border-b pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Visit: {record.dateOfVisit}</h3>
                              <p className="text-sm text-muted-foreground">Dr. {record.attendingDoctorName}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p><strong>Symptoms:</strong> {record.symptoms}</p>
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            {record.prescriptions.length > 0 && (
                              <div>
                                <p className="font-medium">Prescriptions:</p>
                                <ul className="list-disc pl-5">
                                  {record.prescriptions.map((prescription, index) => (
                                    <li key={index}>{prescription}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <p><strong>Treatment Plan:</strong> {record.treatmentPlan}</p>
                            {record.followUpInstructions && (
                              <p><strong>Follow-up:</strong> {record.followUpInstructions}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No medical records found for this patient.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
