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
import { Patient } from "@/types";
import { addPatient } from "@/lib/mock-data";

const patientSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  contactPhone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  nextOfKin: z.object({
    name: z.string().min(3, "Next of kin name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    contact: z.string().min(8, "Valid contact number is required"),
  }),
  medicalHistory: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  existingPatient?: Patient;
  onSuccess?: (patient: Patient) => void;
}

export default function PatientForm({ existingPatient, onSuccess }: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: existingPatient
      ? {
          fullName: existingPatient.fullName,
          dateOfBirth: existingPatient.dateOfBirth,
          gender: existingPatient.gender,
          contactPhone: existingPatient.contactPhone,
          email: existingPatient.email || "",
          address: existingPatient.address,
          nextOfKin: {
            name: existingPatient.nextOfKin.name,
            relationship: existingPatient.nextOfKin.relationship,
            contact: existingPatient.nextOfKin.contact,
          },
          medicalHistory: existingPatient.medicalHistory || "",
        }
      : {
          fullName: "",
          dateOfBirth: "",
          gender: "male",
          contactPhone: "",
          email: "",
          address: "",
          nextOfKin: {
            name: "",
            relationship: "",
            contact: "",
          },
          medicalHistory: "",
        },
  });

  async function onSubmit(data: PatientFormData) {
    try {
      setIsSubmitting(true);
      
      const patientData: Omit<Patient, "id" | "createdAt" | "updatedAt"> = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        contactPhone: data.contactPhone,
        email: data.email,
        address: data.address,
        nextOfKin: {
          name: data.nextOfKin.name,
          relationship: data.nextOfKin.relationship,
          contact: data.nextOfKin.contact,
        },
        medicalHistory: data.medicalHistory,
      };
      
      const newPatient = await addPatient(patientData);
      
      toast({
        title: "Success",
        description: "Patient has been registered successfully.",
      });
      
      if (onSuccess) {
        onSuccess(newPatient);
      } else {
        navigate("/patients");
      }
    } catch (error) {
      console.error("Error registering patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register patient. Please try again.",
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+233 55 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="patient@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Campus Avenue, Berekuso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted/30 p-4 rounded-md border">
          <h3 className="font-medium mb-3">Next of Kin Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="nextOfKin.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextOfKin.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input placeholder="Spouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextOfKin.contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+233 55 765 4321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical History (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any pre-existing conditions, allergies, or relevant medical history"
                  className="min-h-[120px]"
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
            {isSubmitting ? "Submitting..." : existingPatient ? "Update Patient" : "Register Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
