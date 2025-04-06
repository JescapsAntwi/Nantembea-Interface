
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FlaskConical, AlertTriangle } from 'lucide-react';
import { fetchDashboardStats, fetchAppointments } from '@/lib/mock-data';
import { Appointment } from '@/types';

type DashboardStats = {
  totalPatients: number;
  totalAppointments: number;
  completedTests: number;
  pendingTests: number;
  medicationAlerts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    completedTests: 0,
    pendingTests: 0,
    medicationAlerts: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await fetchDashboardStats() as DashboardStats;
        const appointments = await fetchAppointments();
        const sortedAppointments = appointments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        
        setStats(dashboardStats);
        setRecentAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {isLoading ? (
        <div>Loading dashboard data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-gradient-blue">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPatients}</div>
                <p className="text-sm text-muted-foreground mt-1">Total registered patients</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/patients">View all</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient-purple">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <p className="text-sm text-muted-foreground mt-1">Scheduled appointments</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/appointments">View all</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient-teal">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FlaskConical className="mr-2 h-4 w-4" /> Lab Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedTests} <span className="text-sm font-normal text-muted-foreground">completed</span>
                </div>
                <div className="mt-1">
                  {stats.pendingTests} <span className="text-sm text-muted-foreground">pending</span>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/lab-tests">View all</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient-amber">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.medicationAlerts}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.medicationAlerts === 1 ? 'Medication is' : 'Medications are'} low in stock
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/medications">View inventory</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map(appointment => (
                      <div key={appointment.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent appointments.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/patients/new">New Patient</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/appointments">Schedule Appointment</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/lab-tests">View Lab Tests</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/medications">Check Inventory</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
