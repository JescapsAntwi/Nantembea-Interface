
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Patient, MedicalRecord, StaffMember } from "@/types";
import { addMedicalRecord } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prescriptionItemSchema = z.object({
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
});

const medicalRecordSchema = z.object({
  symptoms: z.string().min(3, "Symptoms are required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  prescriptions: z.array(prescriptionItemSchema).min(1, "At least one prescription is required"),
  treatmentPlan: z.string().min(3, "Treatment plan is required"),
  followUpInstructions: z.string().optional(),
  requestLabTest: z.boolean().default(false),
  labTestType: z.string().optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface NewMedicalRecordPageProps {
  patients: Patient[];
  doctors: StaffMember[];
  activeDoctorId?: string;
}

export default function NewMedicalRecordPage({ patients, doctors, activeDoctorId }: NewMedicalRecordPageProps) {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionCount, setPrescriptionCount] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      symptoms: "",
      diagnosis: "",
      prescriptions: [{ medication: "", dosage: "" }],
      treatmentPlan: "",
      followUpInstructions: "",
      requestLabTest: false,
      labTestType: "",
    },
  });

  const watchRequestLabTest = form.watch("requestLabTest");

  useEffect(() => {
    if (patientId) {
      const foundPatient = patients.find((p) => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Patient not found",
        });
        navigate("/patients");
      }
    }

    if (activeDoctorId) {
      const foundDoctor = doctors.find((d) => d.id === activeDoctorId);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      }
    }
  }, [patientId, patients, activeDoctorId, doctors, navigate, toast]);

  const addPrescription = () => {
    const prescriptions = form.getValues("prescriptions") || [];
    form.setValue("prescriptions", [
      ...prescriptions,
      { medication: "", dosage: "" },
    ]);
    setPrescriptionCount(prescriptionCount + 1);
  };

  const removePrescription = (index: number) => {
    const prescriptions = form.getValues("prescriptions") || [];
    if (prescriptions.length > 1) {
      form.setValue(
        "prescriptions",
        prescriptions.filter((_, i) => i !== index)
      );
      setPrescriptionCount(prescriptionCount - 1);
    }
  };

  async function onSubmit(data: MedicalRecordFormData) {
    if (!patient || !doctor) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Patient or doctor information is missing",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const today = new Date().toISOString().split("T")[0];
      
      const recordData: Omit<MedicalRecord, "id"> = {
        patientId: patient.id,
        dateOfVisit: today,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        prescriptions: data.prescriptions.map(p => `${p.medication} - ${p.dosage}`),
        treatmentPlan: data.treatmentPlan,
        followUpInstructions: data.followUpInstructions || "",
        attendingDoctorId: doctor.id,
        attendingDoctorName: doctor.name,
      };
      
      const newRecord = await addMedicalRecord(recordData);

      // If lab test requested, create lab test request
      if (data.requestLabTest && data.labTestType) {
        // Code to create lab test request
        // This would typically save to a database
        console.log("Lab test requested:", {
          patientId: patient.id,
          patientName: patient.fullName,
          requestedBy: doctor.name,
          testType: data.labTestType,
          requestDate: today,
          status: "requested"
        });
      }
      
      toast({
        title: "Success",
        description: "Medical record has been created successfully",
      });
      
      navigate(`/patients/${patient.id}`);
    } catch (error) {
      console.error("Error creating medical record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create medical record. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!patient) {
    return <div>Loading patient information...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Medical Record</h2>
        <p className="text-muted-foreground">
          Create a medical record for the patient's visit
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold">Name</p>
            <p>{patient.fullName}</p>
          </div>
          <div>
            <p className="font-semibold">Date of Birth</p>
            <p>{patient.dateOfBirth}</p>
          </div>
          <div>
            <p className="font-semibold">Gender</p>
            <p>{patient.gender}</p>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <p>{patient.contactPhone}</p>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-md shadow-sm border">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the patient's symptoms"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your diagnosis"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Prescriptions</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPrescription}
                >
                  Add Prescription
                </Button>
              </div>

              {Array.from({ length: prescriptionCount }).map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`prescriptions.${index}.medication`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Medication" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prescriptions.${index}.dosage`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Dosage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-0"
                      onClick={() => removePrescription(index)}
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="treatmentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Plan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the treatment plan"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followUpInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-up Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter follow-up instructions if needed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestLabTest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Request Lab Test</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {watchRequestLabTest && (
              <FormField
                control={form.control}
                name="labTestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Test Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lab test type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blood_test">Blood Test</SelectItem>
                        <SelectItem value="urine_analysis">Urine Analysis</SelectItem>
                        <SelectItem value="x_ray">X-Ray</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ct_scan">CT Scan</SelectItem>
                        <SelectItem value="ultrasound">Ultrasound</SelectItem>
                        <SelectItem value="ecg">ECG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Medical Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
