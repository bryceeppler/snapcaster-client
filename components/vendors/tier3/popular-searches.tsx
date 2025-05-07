import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularBuyClicksByTCG } from "@/lib/GA4Client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface PopularSearchesProps {
  searchData: PopularBuyClicksByTCG;
  variant: "light" | "dark";
}

export function PopularBuyClicks({ searchData, variant }: PopularSearchesProps) {
  const tcgs = Object.keys(searchData);
  const tcgSlugToName = {
    mtg: 'Magic: The Gathering',
    yugioh: 'Yu-Gi-Oh!',
    pokemon: 'Pokémon',
    lorcana: 'Lorcana',
    starwars: 'Star Wars',
    onepiece: 'One Piece',
    fleshandblood: 'Flesh and Blood',
  }
  const [selectedTcg, setSelectedTcg] = useState<string>(tcgs[0]);

  return (
    <Card className="bg-transparent h-[400px] border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="">Popular Buy Clicks</CardTitle>
        <CardDescription className=" text-zinc-600">Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-full space-y-4">
          <Select value={selectedTcg} onValueChange={setSelectedTcg}>
            <SelectTrigger className="w-[200px] ">
              <SelectValue placeholder="Select a TCG" />
            </SelectTrigger>
            <SelectContent>
              {tcgs.map((tcg) => (
                <SelectItem key={tcg} value={tcg}>
                  {tcgSlugToName[tcg as keyof typeof tcgSlugToName] || tcg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 -mx-4">
            <div className="w-full flex px-4">
                <div className="flex flex-row justify-between w-full py-2 px-4 bg-zinc-100 backdrop-blur-sm rounded-sm">
                    <span className="">Card Name</span>
                    <span className="">Buy Clicks</span>
                </div>
            </div>
            <ScrollArea className="h-[205px] w-full px-4">
              <Table>
  
                <TableBody>
                  {searchData[selectedTcg]?.map((card, index) => (
                    <TableRow key={`${card.cardName}-${index}`} className="hover:bg-popover/10">
                      <TableCell className=" font-medium py-2">
                        {card.cardName}
                      </TableCell>
                      <TableCell className=" text-right py-2">
                        {card.count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
