
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => string | number | React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  color?: "default" | "destructive";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchField?: keyof T;
  emptyMessage?: string;
}

export default function DataTable<T>({
  data,
  columns,
  actions,
  isLoading = false,
  searchable = false,
  searchField,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = React.useMemo(() => {
    if (!searchable || !searchTerm || !searchField) return data;

    return data.filter((item) => {
      const fieldValue = item[searchField];
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  }, [data, searchTerm, searchable, searchField]);

  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }

    if (typeof column.accessorKey === "function") {
      return column.accessorKey(row);
    }

    const value = row[column.accessorKey as keyof T];
    
    if (value === null || value === undefined) {
      return "-";
    }
    
    return typeof value === 'object' ? 
      JSON.stringify(value) : 
      String(value);
  };

  return (
    <div className="space-y-4">
      {searchable && searchField && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {actions && <TableHead className="w-[80px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`loading-${rowIndex}-${colIndex}`}>
                      <div className="h-4 w-[80%] animate-pulse bg-muted rounded"></div>
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="h-4 w-8 animate-pulse bg-muted rounded"></div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`}>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={cn(
                                action.color === "destructive" &&
                                  "text-destructive focus:text-destructive"
                              )}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
