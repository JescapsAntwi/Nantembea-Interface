
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { addAppointment } from "@/lib/mock-data";
import { Appointment, Patient, StaffMember } from "@/types";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  reason: z.string().min(3, "Reason for appointment is required"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  patients: Patient[];
  doctors: StaffMember[];
  existingAppointment?: Appointment;
  onSuccess?: (appointment: Appointment) => void;
}

export default function AppointmentForm({ 
  patients, 
  doctors, 
  existingAppointment, 
  onSuccess 
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: existingAppointment
      ? {
          patientId: existingAppointment.patientId,
          doctorId: existingAppointment.doctorId,
          date: existingAppointment.date,
          time: existingAppointment.time,
          reason: existingAppointment.reason,
          notes: existingAppointment.notes || "",
        }
      : {
          patientId: "",
          doctorId: "",
          date: "",
          time: "",
          reason: "",
          notes: "",
        },
  });

  async function onSubmit(data: AppointmentFormData) {
    try {
      setIsSubmitting(true);
      
      // Find the selected patient and doctor to include their names
      const selectedPatient = patients.find(p => p.id === data.patientId);
      const selectedDoctor = doctors.find(d => d.id === data.doctorId);
      
      if (!selectedPatient || !selectedDoctor) {
        throw new Error("Selected patient or doctor not found");
      }
      
      // Fix: Ensure all required fields are present and not optional
      const appointmentData: Omit<Appointment, "id"> = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        reason: data.reason,
        notes: data.notes,
        patientName: selectedPatient.fullName,
        doctorName: selectedDoctor.name,
        status: "scheduled"
      };
      
      const newAppointment = await addAppointment(appointmentData);
      
      toast({
        title: "Success",
        description: "Appointment has been scheduled successfully.",
      });
      
      if (onSuccess) {
        onSuccess(newAppointment);
      } else {
        navigate("/appointments");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors
                      .filter(staff => staff.role === "doctor")
                      .map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Appointment</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Follow-up, consultation, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about the appointment"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : existingAppointment ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
