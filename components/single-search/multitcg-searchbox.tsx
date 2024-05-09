import React from 'react';
import SingleSearchbox from '../autofill-searchbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import useSingleStore from '@/stores/singleSearchStore';

import type { Tcgs } from '@/types/index';

type Props = {};

const MultiTcgSearchbox = (props: Props) => {
  const { fetchCards, searchInput, setSearchInput, tcg, setTcg } =
    useSingleStore();
  const autocompleteEndpoint =
    process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL + '/cards?query=';

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select value={tcg} onValueChange={(value: Tcgs) => setTcg(value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="MTG" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select TCG</SelectLabel>
            <SelectItem value="mtg">MTG</SelectItem>
            <SelectItem value="pokemon">Pokemon</SelectItem>
            <SelectItem value="lorcana">Lorcana</SelectItem>
            <SelectItem value="yugioh">Yu-gi-oh</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <SingleSearchbox
        searchFunction={fetchCards}
        setSearchInput={setSearchInput}
        searchInput={searchInput}
        autocompleteEndpoint={autocompleteEndpoint}
      />
    </div>
  );
};

export default MultiTcgSearchbox;
