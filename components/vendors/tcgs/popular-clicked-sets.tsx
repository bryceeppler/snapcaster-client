'use client';

import { format } from 'date-fns';
import * as React from 'react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TableSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { usePopularClickedSets } from '@/lib/hooks/useAnalytics';

interface PopularClickedSetsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

interface SetData {
  setName: string;
  count: number;
}

export function PopularClickedSets({ dateRange }: PopularClickedSetsProps) {
  const { data, isLoading, error } = usePopularClickedSets(
    dateRange.from,
    dateRange.to,
    50
  );
  const [selectedTcg, setSelectedTcg] = useState<string>('');

  const tcgSlugToName = {
    mtg: 'Magic: The Gathering',
    yugioh: 'Yu-Gi-Oh!',
    pokemon: 'Pokémon',
    lorcana: 'Lorcana',
    starwars: 'Star Wars',
    onepiece: 'One Piece',
    fleshandblood: 'Flesh and Blood'
  };

  // Set initial selected TCG when data is loaded
  if (data && !selectedTcg && Object.keys(data).length > 0) {
    setSelectedTcg(Object.keys(data)[0]);
  }

  if (isLoading) {
    return (
      <TableSkeleton
        title="Popular Clicked Sets"
        dateRange={dateRange}
        height={400}
      />
    );
  }

  if (error || !data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Popular Clicked Sets</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-sm text-red-500">
            {error
              ? `Failed to load data: ${error.message}`
              : 'No data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tcgData = data;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Popular Clicked Sets</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </div>
        <Select value={selectedTcg} onValueChange={setSelectedTcg}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a TCG" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(tcgData).map((tcg) => (
              <SelectItem key={tcg} value={tcg}>
                {tcgSlugToName[tcg as keyof typeof tcgSlugToName] || tcg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="relative max-h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Card Name</TableHead>
                <TableHead className="text-right">Buy Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tcgData[selectedTcg]?.map((set: SetData, index: number) => (
                <TableRow key={`${set.setName}-${index}`}>
                  <TableCell className="capitalize">{set.setName}</TableCell>
                  <TableCell className="text-right">
                    {set.count.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
