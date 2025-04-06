
import { useNavigate } from "react-router-dom";
import { Patient } from "@/types";
import PatientForm from "@/components/PatientForm";
import { useToast } from "@/components/ui/use-toast";

export default function NewPatientPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSuccess = (patient: Patient) => {
    toast({
      title: "Success",
      description: `Patient ${patient.fullName} has been registered successfully.`,
    });
    navigate("/patients");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Register New Patient</h2>
        <p className="text-muted-foreground">
          Add a new patient to the system
        </p>
      </div>

      <div className="rounded-md border p-4 md:p-6">
        <PatientForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
