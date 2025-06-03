'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { useVendorLeaderboard } from '@/lib/hooks/useAnalytics';
import { formatChartDate } from '@/lib/utils';
const TCG_ORDER = [
  'mtg',
  'pokemon',
  'yugioh',
  'onepiece',
  'lorcana',
  'starwars',
  'fleshandblood'
] as const;

const tcgLabels = {
  mtg: 'MTG',
  pokemon: 'Pokémon',
  yugioh: 'Yu-Gi-Oh!',
  onepiece: 'One Piece',
  lorcana: 'Lorcana',
  starwars: 'Star Wars',
  fleshandblood: 'Flesh and Blood'
};

function normalizeWebsiteUrl(url: string): string {
  // Remove common prefixes and suffixes
  let hostname = url
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove http://, https://, www.
    .replace(/\.(com|ca|net|org|io).*$/, ''); // Remove .com, .ca, etc and anything after

  if (hostname === 'store.401games') {
    hostname = '401games';
  }

  return hostname;
}

interface VendorLeaderboardProps {
  numberOfDays?: number;
  dateRange?: {
    from: Date;
    to: Date;
  };
  chartHeight?: number | string;
  className?: string;
}

export function VendorLeaderboard({
  numberOfDays,
  dateRange,
  chartHeight = 250,
  className
}: VendorLeaderboardProps) {
  // Use either dateRange or numberOfDays
  const { profile } = useAuth();
  const { data, isLoading, error } = useVendorLeaderboard(
    dateRange ? dateRange.from : numberOfDays,
    dateRange ? dateRange.to : undefined,
    0
  );
  const { vendors, getVendorIdBySlug } = useVendors();

  // Convert chartHeight to a string with 'px' if it's a number
  const heightClass =
    typeof chartHeight === 'number' ? `h-[${chartHeight}px]` : chartHeight;

  if (isLoading) {
    return (
      <ChartSkeleton
        title="Leaderboard"
        height={chartHeight as number}
        description="Buy clicks by TCG across vendors"
        footer={true}
      />
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </CardHeader>
        <CardContent
          className={`flex items-center justify-center ${heightClass}`}
        >
          <p className="text-sm text-red-500">Failed to load vendor data</p>
        </CardContent>
      </Card>
    );
  }

  const startDate = data?.startDate ? formatChartDate(data.startDate) : '';
  const endDate = data?.endDate ? formatChartDate(data.endDate) : '';

  // Process the data to use proper website names
  const processedData = data?.data.map((item) => {
    const website = item.website || 'unknown';
    const normalizedUrl = normalizeWebsiteUrl(website);
    const vendor = vendors.find(
      (v) => normalizeWebsiteUrl(v.url) === normalizedUrl
    );
    return {
      ...item,
      vendor: vendor?.name || normalizedUrl, // Fallback to normalized URL if website not found
      originalUrl: website, // Keep original URL for tooltip
      slug: vendor?.slug
    };
  });

  return (
    <Card className={className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex">
        <ScrollArea className={`${heightClass} w-1 flex-1`}>
          <div className="min-w-max">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[30px] whitespace-nowrap">
                    Rank
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Vendor
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap text-right">
                    Total Clicks
                  </TableHead>
                  {TCG_ORDER.map((tcg) => (
                    <TableHead
                      key={tcg}
                      className="w-[120px] whitespace-nowrap text-right"
                    >
                      {tcgLabels[tcg]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData?.map((vendor, index) => (
                  <TableRow
                    key={vendor.website}
                    className={
                      profile?.data.user.vendorData?.vendorId ===
                      getVendorIdBySlug(vendor.slug || '')
                        ? 'bg-primary/50'
                        : ''
                    }
                  >
                    <TableCell className="w-[30px] whitespace-nowrap">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className="max-w-[120px] font-medium"
                      title={vendor.website}
                    >
                      {vendor.vendor || vendor.website}
                    </TableCell>
                    <TableCell className="w-[120px] text-right">
                      {vendor.total.toLocaleString()}
                    </TableCell>
                    {TCG_ORDER.map((tcg) => (
                      <TableCell key={tcg} className="w-[120px] text-right">
                        {vendor[tcg] ? (
                          <div className="flex flex-col">
                            <span>{vendor[tcg].toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">
                              {((vendor[tcg] / vendor.total) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-2 text-sm">
        <div className="h-[16px] leading-none opacity-0">
          {/* This invisible element maintains the same height as the trend indicator in TrafficChart */}
          Placeholder for alignment
        </div>
        <div className="leading-none text-muted-foreground">
          {startDate} - {endDate}
        </div>
      </CardFooter>
    </Card>
  );
}
