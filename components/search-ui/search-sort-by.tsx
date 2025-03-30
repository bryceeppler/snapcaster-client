import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type Props = {
  sortBy: any;
  setSortBy: (sortBy: any) => void;
  fetchCards: () => Promise<void>;
  setCurrentPage: (currentPage: number) => void;

  sortByOptions: any;
};
export default function SearchSortBy({
  sortBy,
  setSortBy,
  fetchCards,
  setCurrentPage,

  sortByOptions
}: Props) {
  const handleSortByChange = (value: any) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-min px-0"
          asChild
          variant={'noOutline'}
        >
          <Button
            variant="outline"
            className="flex h-min  w-full shrink-0 items-center justify-center bg-transparent"
          >
            <div className="flex items-center">
              <span className="text-sm">{sortByOptions?.[sortBy]}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]"
          align="end"
        >
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => handleSortByChange(value as any)}
          >
            {sortByOptions &&
              Object.entries(sortByOptions).map(([key, label]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {label as string}
                </DropdownMenuRadioItem>
              ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
