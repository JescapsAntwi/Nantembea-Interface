
import React from "react";
import { MedicalRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MedicalRecordListProps {
  records: MedicalRecord[];
  isLoading?: boolean;
}

export default function MedicalRecordList({
  records,
  isLoading = false,
}: MedicalRecordListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent animate-pulse" />
            <CardHeader className="pb-2">
              <div className="h-6 w-1/3 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-4 text-center text-muted-foreground">
            No medical records found for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort records by date (most recent first)
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.dateOfVisit).getTime() - new Date(a.dateOfVisit).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedRecords.map((record) => (
        <Card key={record.id} className="group hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              <span>
                Visit on {format(new Date(record.dateOfVisit), "MMMM d, yyyy")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Diagnosis
                </h4>
                <p className="mt-1">{record.diagnosis}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Doctor
                </h4>
                <p className="mt-1">{record.attendingDoctorName}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary hover:text-primary group-hover:translate-x-1 transition-transform"
                onClick={() => navigate(`/medical-records/${record.id}`)}
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
