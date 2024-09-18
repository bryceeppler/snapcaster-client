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

type Props = {};
export default function BuyListSearchBox({}: Props) {
  const { changeTCG } = useBuyListStore();
  return (
    <>
      {/* Search Container*/}
      <div className="flex">
        <Select
          onValueChange={(value) => {
            changeTCG(value);
          }}
        >
          <SelectTrigger className=" border-border-colour w-1/2 rounded-r-none focus:ring-0 focus:ring-offset-0  sm:w-[180px] ">
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

        <Input
          className="border-l-none border-border-colour rounded-l-none bg-card pr-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={`Card Name`}
        ></Input>
      </div>
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-primary"
      >
        <Search size={15} />
      </button>
    </>
  );
}
