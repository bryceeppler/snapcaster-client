import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { type SelectRangeEventHandler } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import DashboardLayout from '../layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { VendorLeaderboard } from '@/components/vendors/vendors/vendor-leaderboard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
export default function SettingsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const handleDateRangeChange: SelectRangeEventHandler = (range) => {
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
              Settings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
