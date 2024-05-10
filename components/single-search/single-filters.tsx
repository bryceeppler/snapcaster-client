import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import useSingleStore from '@/stores/singleSearchStore';
type Props = {};

const conditionLabels = ['NM', 'LP', 'PL', 'MP', 'HP', 'DMG', 'SCAN'];

const SingleSearchFilter = (props: Props) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const {
    sortOrder,
    sortField,
    conditions,
    foil,
    toggleFoil,
    toggleSortOrder,
    setSortField,
    setConditions,
    clearFilters
  } = useSingleStore();

  // Handle toggling checkbox selection for conditions
  const handleConditionToggle = (condition: string) => {
    let newConditions = [...conditions];
    if (newConditions.includes(condition)) {
      newConditions = newConditions.filter((item) => item !== condition);
    } else {
      newConditions.push(condition);
    }
    setConditions(newConditions);
  };
  return (
    <div>
      {showFilters && (
        <div className="outlined-container flex flex-col items-center gap-3 p-3">
          <div className="flex flex-row gap-3">
            <Select
              value={sortField}
              onValueChange={(value) => {
                setSortField(value);
              }}
            >
              <SelectTrigger className="w-[120px] sm:w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="set">Set</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={toggleSortOrder}
              className="flex items-center justify-center p-2"
              aria-label="Toggle sort order"
              variant="outline"
            >
              <ChevronDown
                className={`transition-transform duration-200 ${
                  sortOrder === 'desc' ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </Button>
          </div>
          {/* Foil only */}
          <div className="flex items-center space-x-2">
            <Switch
              id="foil-only"
              checked={foil}
              onCheckedChange={toggleFoil}
            />
            <Label htmlFor="foil-only">Foil only</Label>
          </div>
          {/* Condition selector checkboxes */}
          <div className="grid max-w-md grid-cols-2 gap-x-10 gap-y-2">
            {conditionLabels.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={conditions.includes(condition)}
                  onCheckedChange={() => handleConditionToggle(condition)}
                />
                <Label htmlFor={`condition-${condition}`}>{condition}</Label>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              clearFilters();
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      <Button
        className="mx-auto my-2 flex justify-between rounded bg-transparent outline outline-1 outline-muted lg:w-48"
        onClick={() => {
          setShowFilters(!showFilters);
        }}
      >
        {showFilters ? 'Hide filters' : 'Show filters'}
        <ChevronDown
          className={`h-4 w-4 transform transition-all ${
            showFilters ? 'rotate-180' : ''
          }`}
        />
      </Button>
    </div>
  );
};

export default SingleSearchFilter;
