
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  colorClass?: string;
  isLoading?: boolean;
  gradient?: "blue" | "purple" | "rose" | "teal" | "amber";
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  colorClass = "bg-primary", 
  isLoading = false,
  gradient = "blue",
}: StatCardProps) {
  const gradientClass = `card-gradient-${gradient}`;

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm", gradientClass)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("icon-container-sm", colorClass)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 w-20 bg-muted animate-pulse-light rounded" />
            {description && <div className="h-4 w-40 bg-muted animate-pulse-light rounded" />}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
