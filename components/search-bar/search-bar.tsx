import { useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const cardGames = [
  { value: 'mtg', label: 'MTG' },
  { value: 'pokemon', label: 'Pokémon' },
  { value: 'yugioh', label: 'Yu-Gi-Oh!' },
  { value: 'onepiece', label: 'One Piece' },
  { value: 'lorcana', label: 'Lorcana' }
];

export default function SingleSearchBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('mtg');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  // const handleSearch = (value: string) => {
  //   setSearch(value);
  //   // Simulating autocomplete results
  //   const filteredResults = cardGames
  //     .filter((game) => game.label.toLowerCase().includes(value.toLowerCase()))
  //     .slice(0, 5);
  //   setResults(filteredResults);
  // };

  return (
    <div className="flex w-full max-w-3xl items-center space-x-4 rounded-full bg-zinc-600 p-2">
      {/* TCG Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className="r w-[180px] justify-between bg-zinc-600"
          >
            {value
              ? cardGames.find((game) => game.value === value)?.label
              : 'Select a TCG'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] bg-zinc-500 p-0">
          <Command>
            <CommandInput
              placeholder="Search card game..."
              className="h-9 bg-zinc-500 text-white"
            />
            <CommandEmpty>No card game found.</CommandEmpty>
            <CommandGroup>
              {cardGames.map((game) => (
                <CommandItem
                  key={game.value}
                  value={game.value}
                  onSelect={() => {
                    setValue(game.value); // Correctly set the value using game.value
                    setOpen(false);
                  }}
                  className="text-white hover:bg-gray-600"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === game.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {game.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Input */}
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search for a card..."
          value={search}
          // onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-full bg-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md bg-gray-700 shadow-lg">
            {results.map((result, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => {
                  setSearch(result.label);
                  setResults([]);
                }}
              >
                {result.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Search className="h-6 w-10 text-white" />
    </div>
  );
}
