
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Medication } from "@/types";
import { fetchMedications } from "@/lib/mock-data";
import { Plus, AlertTriangle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { format, isPast, addDays, isBefore } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadMedications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMedications();
        setMedications(data);
        
        // Check for low stock medications
        const lowStockItems = data.filter(med => med.currentStock <= med.minimumStock);
        if (lowStockItems.length > 0) {
          toast({
            title: "Low Stock Alert",
            description: `${lowStockItems.length} medications are running low on stock`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading medications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, [toast]);

  const getStockStatus = (medication: Medication) => {
    const stockRatio = medication.currentStock / medication.minimumStock;
    
    if (medication.currentStock <= medication.minimumStock * 0.5) {
      return <Badge variant="outline" className="bg-red-100/80 text-red-800 hover:bg-red-100">Critical</Badge>;
    } else if (medication.currentStock <= medication.minimumStock) {
      return <Badge variant="outline" className="bg-yellow-100/80 text-yellow-800 hover:bg-yellow-100">Low</Badge>;
    } else if (stockRatio <= 1.5) {
      return <Badge variant="outline" className="bg-blue-100/80 text-blue-800 hover:bg-blue-100">Moderate</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100/80 text-green-800 hover:bg-green-100">Good</Badge>;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);

    if (isPast(expiry)) {
      return <Badge variant="outline" className="bg-red-100/80 text-red-800 hover:bg-red-100">Expired</Badge>;
    } else if (isBefore(expiry, thirtyDaysFromNow)) {
      return <Badge variant="outline" className="bg-yellow-100/80 text-yellow-800 hover:bg-yellow-100">Expiring Soon</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100/80 text-green-800 hover:bg-green-100">Valid</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medication Inventory</h2>
          <p className="text-muted-foreground">
            Track and manage medication stock levels
          </p>
        </div>
        <Button asChild>
          <Link to="/medications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Link>
        </Button>
      </div>

      <DataTable
        data={medications}
        isLoading={isLoading}
        searchable
        searchField="name"
        columns={[
          {
            header: "Medication",
            accessorKey: (row) => (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{row.name}</span>
              </div>
            ),
          },
          {
            header: "Dosage",
            accessorKey: "dosage",
          },
          {
            header: "Stock Level",
            accessorKey: (row) => (
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {row.currentStock} / Min: {row.minimumStock}
                  </span>
                  {row.currentStock <= row.minimumStock && (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                </div>
                <Progress 
                  value={Math.min((row.currentStock / row.minimumStock) * 50, 100)} 
                  className="h-2"
                />
              </div>
            ),
          },
          {
            header: "Status",
            accessorKey: (row) => getStockStatus(row),
          },
          {
            header: "Expiry",
            accessorKey: (row) => (
              <div className="space-y-1">
                <div>{format(new Date(row.expiryDate), 'MMM d, yyyy')}</div>
                <div>{getExpiryStatus(row.expiryDate)}</div>
              </div>
            ),
          },
        ]}
        actions={[
          {
            label: "Update Stock",
            onClick: () => {},
          },
          {
            label: "View History",
            onClick: () => {},
          },
        ]}
      />
    </div>
  );
}
