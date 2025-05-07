"use client"

import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCityAnalytics } from "@/lib/hooks/useAnalytics"
import { TableSkeleton } from "@/components/vendors/dashboard/chart-skeleton"

interface CityAnalyticsTableProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function CityAnalyticsTable({ dateRange }: CityAnalyticsTableProps) {
  const { data, isLoading, error } = useCityAnalytics(dateRange.from, dateRange.to);

  if (isLoading) {
    return <TableSkeleton title="City Distribution" dateRange={dateRange} height={400} />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>City Distribution</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load city data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>City Distribution</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative max-h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((city) => (
                <TableRow key={city.city}>
                  <TableCell>{city.city}</TableCell>
                  <TableCell className="text-right">{city.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{city.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}