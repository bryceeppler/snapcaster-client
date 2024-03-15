import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useStore } from '@/stores/store';
import { Button } from './ui/button';
type Props = {};

const SingleSearchFilter = (props: Props) => {
  const {
    showSingleSearchFilters,
    toggleShowSingleSearchFilters,
    toggleSingleSearchCondition,
    singleSearchConditions,
    resetSingleSearchFilters,
    singleSearchFoil,
    toggleSingleSearchOrderBy,
    toggleSingleSearchFoil,
    setSingleSearchOrderBy,
    setSingleSearchOrder,
    singleSearchOrderBy,
    singleSearchOrder
  } = useStore();
  const conditionCheckboxes = [
    { label: 'NM', value: false },
    { label: 'LP', value: false },
    { label: 'PL', value: false },
    { label: 'MP', value: false },
    { label: 'HP', value: false },
    { label: 'DMG', value: false },
    { label: 'SCAN', value: false }
  ];
  return (
    <div>
      {showSingleSearchFilters && (
        <div className="outlined-container flex flex-col items-center gap-3 p-3">
          <div className="flex flex-row gap-3">
            <Select
              value={singleSearchOrderBy}
              onValueChange={(value) => {
                setSingleSearchOrderBy(value);
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
              onClick={toggleSingleSearchOrderBy}
              className="flex items-center justify-center p-2"
              aria-label="Toggle sort order"
              variant="outline"
            >
              <ChevronDown
                className={`transition-transform duration-200 ${
                  singleSearchOrder === 'desc' ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </Button>
          </div>
          {/* Foil only */}
          <div className="flex items-center space-x-2">
            <Switch
              id="foil-only"
              checked={singleSearchFoil}
              onCheckedChange={toggleSingleSearchFoil}
            />
            <Label htmlFor="foil-only">Foil only</Label>
          </div>
          {/* Condition selector */}
          <div className="grid max-w-md grid-cols-2 gap-x-10 gap-y-2">
            {conditionCheckboxes.map((condition) => {
              return (
                <div
                  className="flex items-center space-x-2"
                  key={condition.label}
                >
                  <Checkbox
                    id={condition.label}
                    checked={
                      singleSearchConditions[condition.label.toLowerCase()]
                    }
                    onCheckedChange={() =>
                      toggleSingleSearchCondition(condition.label.toLowerCase())
                    }
                  />
                  <Label htmlFor={condition.label}>{condition.label}</Label>
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => {
              resetSingleSearchFilters();
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      <Button
        variant="ghost"
        onClick={() => {
          toggleShowSingleSearchFilters();
        }}
        className="my-2"
      >
        {showSingleSearchFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </div>
  );
};

export default SingleSearchFilter;
