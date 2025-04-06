
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, DownloadCloud, PieChart as PieChartIcon, BarChart as BarChartIcon, Users, Calendar } from "lucide-react";

const visitData = [
  { month: 'Jan', visits: 65 },
  { month: 'Feb', visits: 59 },
  { month: 'Mar', visits: 80 },
  { month: 'Apr', visits: 81 },
  { month: 'May', visits: 56 },
  { month: 'Jun', visits: 55 },
  { month: 'Jul', visits: 40 },
];

const diagnosisData = [
  { name: 'Hypertension', value: 42 },
  { name: 'Diabetes', value: 28 },
  { name: 'Respiratory Infections', value: 15 },
  { name: 'Arthritis', value: 10 },
  { name: 'Other', value: 5 },
];

const medicationData = [
  { name: 'Antibiotics', value: 35 },
  { name: 'Painkillers', value: 25 },
  { name: 'Antihypertensives', value: 20 },
  { name: 'Insulin', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("last_month");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      console.log("Report generated for period:", reportPeriod);
      // In a real application, this would trigger a download or open a new window
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and view analytics reports for the clinic
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700">Patient Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-700">347</div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-700 mt-2">+12% from previous month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700">New Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-700">58</div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-700 mt-2">+5% from previous month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-700">Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-700">124</div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-700 mt-2">+8% from previous month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700">Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-700">289</div>
              <Calendar className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xs text-amber-700 mt-2">+15% from previous month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Export Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Patient Visits by Month
                </CardTitle>
                <CardDescription>
                  Number of patient visits over the last 7 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Diagnosis Distribution
                </CardTitle>
                <CardDescription>
                  Most common diagnoses by percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {diagnosisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => `${value} patients`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Medication Prescription Breakdown
                </CardTitle>
                <CardDescription>
                  Most commonly prescribed medications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={medicationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {medicationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => `${value} prescriptions`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>
                Create detailed reports for different time periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Period</label>
                <Select
                  value={reportPeriod}
                  onValueChange={setReportPeriod}
                >
                  <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="last_week">Last Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_quarter">Last Quarter</SelectItem>
                    <SelectItem value="year_to_date">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Available Reports</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4 hover:bg-blue-50 border-blue-200"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-8 w-8 text-blue-600" />
                    <span>Patient Visits</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4 hover:bg-green-50 border-green-200"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-8 w-8 text-green-600" />
                    <span>Treatments</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4 hover:bg-purple-50 border-purple-200"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-8 w-8 text-purple-600" />
                    <span>Lab Tests</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4 hover:bg-amber-50 border-amber-200"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-8 w-8 text-amber-600" />
                    <span>Medications</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  <DownloadCloud className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate All Reports"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
