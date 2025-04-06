
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { fetchLabTest, updateLabTest } from '@/lib/mock-data';
import { LabTest } from '@/types';
import { toast } from 'sonner';

export default function LabTestResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [labTest, setLabTest] = useState<LabTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resultsText, setResultsText] = useState('');
  const [commentsText, setCommentsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!id) return;

      try {
        const test = await fetchLabTest(id);
        if (test) {
          setLabTest(test);
          setResultsText(test.results || '');
          // We need to handle the case where comments might not exist on the type
          const testComments = (test as any).comments || '';
          setCommentsText(testComments);
        }
      } catch (error) {
        console.error("Error fetching lab test:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  const handleSaveResults = async () => {
    if (!labTest || !id) return;

    setIsSaving(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      const updatedTest = await updateLabTest(id, {
        results: resultsText,
        resultDate: now,
        status: 'completed',
        // Adding comments as any since it's not in the type
        ...(commentsText && { comments: commentsText } as any)
      });
      
      setLabTest(updatedTest);
      toast.success("Lab test results saved successfully");
    } catch (error) {
      console.error("Error saving lab test results:", error);
      toast.error("Failed to save results. Please try again.");
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading lab test details...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!labTest) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Lab test not found.</div>
            <div className="text-center mt-4">
              <Button onClick={() => navigate('/lab-tests')}>Back to Lab Tests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lab Test Results</h1>
        <Button variant="outline" onClick={() => navigate('/lab-tests')}>
          Back to Lab Tests
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Patient</h3>
              <p className="font-medium">{labTest.patientName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Test Type</h3>
              <p className="capitalize">{labTest.testType.replace('_', ' ')}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Requested By</h3>
              <p>{labTest.requestedBy}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Request Date</h3>
              <p>{new Date(labTest.requestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
              <div>{getStatusBadge(labTest.status)}</div>
            </div>
            {labTest.status === "completed" && labTest.resultDate && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Result Date</h3>
                <p>{new Date(labTest.resultDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          {labTest.status !== "completed" && (
            <CardDescription>Enter the test results below and save when complete</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Results</h3>
              <Textarea
                placeholder="Enter test results here..."
                value={resultsText}
                onChange={(e) => setResultsText(e.target.value)}
                rows={6}
                disabled={labTest.status === "completed"}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Comments</h3>
              <Textarea
                placeholder="Additional comments or notes about the test..."
                value={commentsText}
                onChange={(e) => setCommentsText(e.target.value)}
                rows={4}
                disabled={labTest.status === "completed"}
              />
            </div>
            
            {labTest.status !== "completed" && (
              <div className="flex justify-end">
                <Button onClick={handleSaveResults} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Results"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
