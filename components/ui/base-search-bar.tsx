import { useRouter } from 'next/router';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTriggerNoIcon as SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { BaseSearchBarProps } from '@/types/navbar';
import { TCG_SELECT_TO_PATH } from '@/utils/tcgPathHelper';

/**
 * A reusable base search bar component that handles the common UI structure and styling
 * for all search bar implementations in the application.
 */
export default function BaseSearchBar({
  tcg,
  searchTerm,
  placeholder = 'Search for a card',
  isLoading = false,
  inputRef,
  onTcgChange,
  onInputChange,
  onInputKeyDown,
  onSearchClick,
  renderAutoComplete,
  showSearchHelp = false,
  searchHelpContent
}: BaseSearchBarProps) {
  const router = useRouter();

  // Handle TCG change with URL redirection
  const handleTcgChange = (value: string) => {
    // Call the original onTcgChange handler
    onTcgChange(value as any);

    // Get the path value for the selected TCG
    const pathValue = TCG_SELECT_TO_PATH[value];
    if (pathValue) {
      // Get current path segments
      const pathSegments = router.asPath.split('/').filter(Boolean);

      // Do not push url path for the homepage (single search). We dont want SEO to be fragmented here especially when people are sharing the Snapcaster URL online.
      if (pathSegments.length > 0) {
        // Replace the last segment with the new TCG path value
        pathSegments[pathSegments.length - 1] = pathValue;
        const newPath = `/${pathSegments.join('/')}`;
        router.push(newPath);
      }
      // If we're at root, don't update the URL - just update the state
    }
  };

  // Default search help content if not provided
  const defaultSearchHelpContent = (
    <div className="rounded-md">
      <div className="w-full">
        <div className="space-y-1 text-xs">
          <div>
            <h1 className="text-sm font-semibold">Search</h1>
            <p className="italic">
              Queries are based on the card base name only and should not be
              combined with set names, foiling, collector number, etc. Please
              use the filters to refine your search.
            </p>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Exact Search</h1>
            <p className="italic">
              Double quote your query if you want to do an exact search. For
              example:
              <span className="rounded px-1 py-0.5 font-mono">
                "Mana Crypt"
              </span>
            </p>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Punctuation</h1>
            <p className="italic">
              Queries are not sensitive to capitalization or punctuation. For
              example:
              <span className="rounded px-1 py-0.5 font-mono">'",:.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const helpContent = searchHelpContent || defaultSearchHelpContent;

  return (
    <div
      className={`border-1 relative w-full rounded-full border bg-background px-1 shadow-sm focus-within:border-primary sm:px-2`}
    >
      <div className={`flex h-8 w-full items-center sm:h-10`}>
        <Select value={tcg} onValueChange={handleTcgChange}>
          <SelectTrigger className="h-8 w-[80px] shrink-0 rounded-l-full rounded-r-none border-b-0 border-l-0 border-r border-t-0 border-border bg-transparent p-1 pl-2 text-xs focus:ring-0 focus:ring-offset-0 sm:h-10 sm:w-[100px] sm:p-2 sm:pl-3 md:w-[120px] lg:w-[150px] [&>span]:!text-left">
            <SelectValue placeholder="TCG" />
            <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0 sm:ml-2 sm:h-4 sm:w-4" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="mtg">MTG</SelectItem>
              <SelectItem value="lorcana">Lorcana</SelectItem>
              <SelectItem value="onepiece">One Piece</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="starwars">Star Wars</SelectItem>
              <SelectItem value="fleshandblood">Flesh and Blood</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="h-full w-full border-none bg-transparent px-1 py-1 text-xs text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 sm:px-2 sm:py-2"
            value={searchTerm}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
          {renderAutoComplete && renderAutoComplete()}
        </div>

        <div className="flex items-center gap-1 text-foreground">
          {showSearchHelp && (
            <Popover>
              <PopoverTrigger asChild>
                <HelpCircle className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground sm:h-4 sm:w-4" />
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                {helpContent}
              </PopoverContent>
            </Popover>
          )}

          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:h-6 sm:w-6" />
          ) : (
            <MagnifyingGlassIcon
              className="mr-1 h-4 w-4 cursor-pointer hover:text-muted-foreground"
              onClick={onSearchClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
