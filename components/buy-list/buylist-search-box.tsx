import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import useBuyListStore from '@/stores/buyListStore';
import { useRef } from 'react';
import { shallow } from 'zustand/shallow';

export default function BuyListSearchBox() {
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const { changeTCG, searchTerm, fetchCards, setSearchTerm } = useBuyListStore(
    (state) => ({
      changeTCG: state.changeTCG,
      searchTerm: state.searchTerm,
      fetchCards: state.fetchCards,
      setSearchTerm: state.setSearchTerm
    }),
    shallow
  );

  const handleClick = () => {
    if (searchBoxRef.current) {
      setSearchTerm(searchBoxRef.current.value);
      fetchCards();
    }
  };

  return (
    <div className="flex">
      {/* Select TCG Dropdown */}
      <Select onValueChange={changeTCG}>
        <SelectTrigger className="border-border-colour w-1/2 rounded-r-none focus:ring-0 focus:ring-offset-0 sm:w-[180px]">
          <SelectValue placeholder="MTG" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select TCG</SelectLabel>
            <SelectItem value="mtg">MTG</SelectItem>
            <SelectItem value="onepiece">One Piece</SelectItem>
            <SelectItem value="pokemon">Pokemon</SelectItem>
            <SelectItem value="lorcana">Lorcana</SelectItem>
            <SelectItem value="yugioh">Yugioh</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        className="border-l-none border-border-colour bg-card rounded-l-none pr-8 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Card Name"
        ref={searchBoxRef}
      />

      {/* Search Button */}
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-primary"
        onClick={handleClick}
      >
        <Search size={15} />
      </button>
    </div>
  );
}
