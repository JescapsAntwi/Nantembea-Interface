
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types";
import { fetchAppointments } from "@/lib/mock-data";
import { Plus, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isPast, isFuture } from "date-fns";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAppointments();
        
        // Sort appointments by date and time
        const sortedAppointments = [...data].sort((a, b) => {
          const dateComparison = a.date.localeCompare(b.date);
          if (dateComparison !== 0) return dateComparison;
          return a.time.localeCompare(b.time);
        });
        
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusBadge = (appointment: Appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    
    switch (appointment.status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100/80 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100/80 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline" className="bg-yellow-100/80 text-yellow-800 hover:bg-yellow-100">Rescheduled</Badge>;
      case 'scheduled':
        if (isToday(appointmentDate)) {
          return <Badge variant="outline" className="bg-blue-100/80 text-blue-800 hover:bg-blue-100">Today</Badge>;
        } else if (isPast(appointmentDate)) {
          return <Badge variant="outline" className="bg-gray-100/80 text-gray-800 hover:bg-gray-100">Missed</Badge>;
        } else {
          return <Badge variant="outline" className="bg-purple-100/80 text-purple-800 hover:bg-purple-100">Upcoming</Badge>;
        }
      default:
        return <Badge variant="outline">{appointment.status}</Badge>;
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            Manage and schedule patient appointments
          </p>
        </div>
        <Button asChild>
          <Link to="/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

      <DataTable
        data={appointments}
        isLoading={isLoading}
        searchable
        searchField="patientName"
        columns={[
          {
            header: "Patient",
            accessorKey: "patientName",
          },
          {
            header: "Doctor",
            accessorKey: "doctorName",
          },
          {
            header: "Date & Time",
            accessorKey: (row) => {
              const date = new Date(`${row.date}T${row.time}`);
              const isAppointmentToday = isToday(date);
              
              return (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-health-600" />
                  <div>
                    <div className={isAppointmentToday ? "font-medium" : ""}>
                      {format(new Date(row.date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(`2000-01-01T${row.time}`), 'h:mm a')}
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            header: "Reason",
            accessorKey: "reason",
            cell: (row) => (
              <div className="max-w-[200px] truncate">{row.reason}</div>
            ),
          },
          {
            header: "Status",
            accessorKey: (row) => getStatusBadge(row),
          },
        ]}
        actions={[
          {
            label: "View Details",
            onClick: handleViewAppointment,
          },
          {
            label: "Cancel",
            onClick: () => {},
            color: "destructive",
          },
        ]}
      />
    </div>
  );
}
