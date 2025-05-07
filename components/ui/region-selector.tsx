import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import AustraliaFlag from './flags/australia-flag';
import CanadaFlag from './flags/canada-flag';

const RegionSelector: React.FC = () => {
  const { region, setRegion } = useSingleSearchStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <div>
          {region === 'ca' ? (
            <CanadaFlag />
          ) : (
            <AustraliaFlag />
          )}
          <span className="sr-only">Select Region</span>
          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setRegion('ca')}>
          <CanadaFlag/>
          <span className="ml-2">CA</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRegion('au')}>
          <AustraliaFlag />
          <span className="ml-2">AU</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegionSelector;
