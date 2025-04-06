
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LabTest } from "@/types";
import { fetchLabTests } from "@/lib/mock-data";

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      try {
        const tests = await fetchLabTests();
        setLabTests(tests);
        setFilteredTests(tests);
      } catch (error) {
        console.error("Error loading lab tests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTests();
  }, []);

  useEffect(() => {
    let filtered = labTests;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        test.testType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(test => test.status === statusFilter);
    }
    
    setFilteredTests(filtered);
  }, [searchTerm, statusFilter, labTests]);

  const handleActionClick = (test: LabTest) => {
    if (test.status === "completed") {
      navigate(`/lab-tests/${test.id}/results`);
    } else {
      navigate(`/lab-tests/${test.id}/results`);
    }
  };

  const getStatusBadge = (status: "requested" | "in_progress" | "completed") => {
    switch (status) {
      case "requested":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Requested</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Fixed to return a string value rather than a function
  const getActionLabel = (test: LabTest): string => {
    switch (test.status) {
      case "requested":
        return "Start Processing";
      case "in_progress":
        return "Enter Results";
      case "completed":
        return "View Results";
      default:
        return "View";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Laboratory Tests</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search by patient name or test type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Laboratory Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading laboratory tests...</div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-4">No laboratory tests found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.patientName}</TableCell>
                    <TableCell className="capitalize">{test.testType.replace('_', ' ')}</TableCell>
                    <TableCell>{test.requestedBy}</TableCell>
                    <TableCell>{new Date(test.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleActionClick(test)}>
                        {getActionLabel(test)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
