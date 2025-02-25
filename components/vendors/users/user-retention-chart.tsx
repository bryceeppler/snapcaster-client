"use client"

import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useUserRetention } from "@/lib/hooks/useAnalytics"
import { Skeleton } from "@/components/ui/skeleton"

interface RetentionDataPoint {
  month: number;
  users: number;
  percentage: number;
}

interface CohortData {
  cohort: string;
  initialUsers: number;
  retention: RetentionDataPoint[];
}

interface UserRetentionChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

function CohortTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Retention</CardTitle>
        <CardDescription>
          Monthly cohort analysis showing how many users return after their first visit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">
                  <Skeleton className="h-5 w-16" />
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">
                  <Skeleton className="h-5 w-16" />
                </th>
                {Array.from({ length: 12 }).map((_, i) => (
                  <th key={i} className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">
                    <Skeleton className="h-5 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="group">
                  <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={j} className="whitespace-nowrap px-4 py-2 text-sm">
                      <Skeleton className="h-5 w-16" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs">
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function UserRetentionChart({ dateRange }: UserRetentionChartProps) {
  const { data, isLoading, error } = useUserRetention(dateRange.from, dateRange.to);

  if (isLoading) {
    return <CohortTableSkeleton />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Retention</CardTitle>
          <CardDescription>
            Monthly cohort analysis showing how many users return after their first visit
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load retention data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Retention</CardTitle>
        <CardDescription>
          Monthly cohort analysis showing how many users return after their first visit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">Cohort</th>
                <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">Users</th>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                  <th key={month} className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium">
                    {month === 0 ? 'Month 0' : `Month ${month}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data.data].reverse().map((cohort) => (
                <tr key={cohort.cohort} className="group hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{cohort.cohort}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">{cohort.initialUsers.toLocaleString()}</td>
                  {cohort.retention.map((retention) => (
                    <td
                      key={retention.month}
                      className="whitespace-nowrap px-4 py-2 text-sm transition-colors"
                      style={{
                        background: `hsl(var(--primary) / ${retention.percentage * 3}%)`,
                        color: retention.percentage > 50 ? 'white' : undefined
                      }}
                    >
                      {retention.percentage}%
                      <span className="ml-1 text-xs opacity-75">
                        ({retention.users.toLocaleString()})
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          * Percentage shows the proportion of users who returned in each month after their first visit
        </div>
      </CardContent>
    </Card>
  );
}