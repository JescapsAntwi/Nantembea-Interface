
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import { fetchPatients } from "@/lib/mock-data";
import { Plus, FileText, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { differenceInYears } from "date-fns";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };
  
  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case 'male':
        return <Badge variant="outline" className="bg-blue-100/80 text-blue-800 hover:bg-blue-100">Male</Badge>;
      case 'female':
        return <Badge variant="outline" className="bg-pink-100/80 text-pink-800 hover:bg-pink-100">Female</Badge>;
      default:
        return <Badge variant="outline">{gender}</Badge>;
    }
  };

  const handleViewMedicalRecords = (patient: Patient) => {
    navigate(`/patients/${patient.id}/records`);
  };

  const handleViewPatient = (patient: Patient) => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage and view patient information
          </p>
        </div>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Link>
        </Button>
      </div>

      <DataTable
        data={patients}
        isLoading={isLoading}
        searchable
        searchField="fullName"
        columns={[
          {
            header: "Name",
            accessorKey: "fullName",
          },
          {
            header: "Gender",
            accessorKey: "gender",
            cell: (row) => getGenderBadge(row.gender),
          },
          {
            header: "Age",
            accessorKey: (row) => calculateAge(row.dateOfBirth),
          },
          {
            header: "Contact",
            accessorKey: "contactPhone",
          },
          {
            header: "Address",
            accessorKey: "address",
            cell: (row) => (
              <div className="max-w-[200px] truncate">{row.address}</div>
            ),
          },
        ]}
        actions={[
          {
            label: "View Patient",
            onClick: handleViewPatient,
          },
          {
            label: "Medical Records",
            onClick: handleViewMedicalRecords,
          },
        ]}
      />
    </div>
  );
}
