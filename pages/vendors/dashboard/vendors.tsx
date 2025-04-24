import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { type PropsRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import DashboardLayout from './layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { VendorLeaderboard } from '@/components/vendors/vendors/vendor-leaderboard';

export default function VendorsAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const handleDateRangeChange: PropsRange['onSelect'] = (range) => {
    if (!range) {
      setDateRange({ from: subDays(new Date(), 30), to: new Date() });
      return;
    }
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Vendor Analytics
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-full justify-start bg-card text-left font-normal md:w-auto"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={1}
                  className="md:hidden"
                />
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="hidden md:block"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="overflow-x-auto">
            <VendorLeaderboard dateRange={dateRange} chartHeight={500} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
