'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePopularClickedCards } from '@/lib/hooks/useAnalytics';
import { TableSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularClickedCardsByTCG } from '@/lib/GA4Client';

interface PopularClickedCardsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

interface CardData {
  cardName: string;
  count: number;
  averagePrice: number;
}

export function PopularClickedCards({ dateRange }: PopularClickedCardsProps) {
  const { data, isLoading, error } = usePopularClickedCards(dateRange.from, dateRange.to, 50);
  const [selectedTcg, setSelectedTcg] = useState<string>("");

  const tcgSlugToName = {
    mtg: 'Magic: The Gathering',
    yugioh: 'Yu-Gi-Oh!',
    pokemon: 'Pokémon',
    lorcana: 'Lorcana',
    starwars: 'Star Wars',
    onepiece: 'One Piece',
    fleshandblood: 'Flesh and Blood',
  };

  // Set initial selected TCG when data is loaded
  if (data && !selectedTcg && Object.keys(data).length > 0) {
    setSelectedTcg(Object.keys(data)[0]);
  }

  if (isLoading) {
    return <TableSkeleton title="Popular Clicked Cards" dateRange={dateRange} height={400} />;
  }

  if (error || !data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Popular Clicked Cards</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-sm text-red-500">
            {error ? `Failed to load data: ${error.message}` : 'No data available'}
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
          <CardTitle>Popular Clicked Cards</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
                <TableHead className="text-right">Avg. Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tcgData[selectedTcg]?.map((card: CardData, index: number) => (
                <TableRow key={`${card.cardName}-${index}`}>
                  <TableCell>{card.cardName}</TableCell>
                  <TableCell className="text-right">{card.count.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${card.averagePrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 