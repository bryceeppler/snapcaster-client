import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface ChartSkeletonProps {
  title: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  height?: number;
  description?: string;
  footer?: boolean;
}

export function ChartSkeleton({
  title,
  dateRange,
  height = 250,
  description,
  footer = false
}: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description
              ? description
              : dateRange
              ? `${format(dateRange.from, 'LLL dd, y')} - ${format(
                  dateRange.to,
                  'LLL dd, y'
                )}`
              : ''}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div style={{ height: `${height}px` }} className="w-full">
          <Skeleton style={{ height: `${height}px` }} className="w-full" />
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 pt-2 text-sm">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-[14px] w-1/3" />
        </CardFooter>
      )}
    </Card>
  );
}

export function TableSkeleton({
  title,
  dateRange,
  height = 400,
  description
}: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {dateRange
              ? `${format(dateRange.from, 'LLL dd, y')} - ${format(
                  dateRange.to,
                  'LLL dd, y'
                )}`
              : description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }} className="w-full">
          {/* Header row */}
          <div className="mb-4 flex w-full justify-between">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mb-3 flex w-full justify-between">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-1/6" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PieChartSkeleton({
  title,
  dateRange,
  description
}: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {dateRange
            ? `${format(dateRange.from, 'LLL dd, y')} - ${format(
                dateRange.to,
                'LLL dd, y'
              )}`
            : description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="flex h-[200px] w-[200px] items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
        <div className="mt-4 flex w-full justify-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
