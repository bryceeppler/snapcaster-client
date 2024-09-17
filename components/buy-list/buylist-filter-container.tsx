import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  TriangleRightIcon,
  MixerHorizontalIcon,
  MixerVerticalIcon,
  ArchiveIcon
} from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import FilterDropDownMultiple from './filter-drop-down-multiple';
import useBuyListStore from '@/stores/buyListStore';
import { useEffect } from 'react';

type Props = { mobile: boolean };

export default function BuyListFilterContainer({ mobile }: Props) {
  const {
    dummyStoreData,
    dummyConditionData,
    dummyFoilData,
    dummyRarityData,
    dummySetData,
    selectedStoreFilters,
    selectedConditionFilters,
    selectedFoilFilters,
    selectedRarityFilters,
    selectedSetFilters,

    updateSelectedStoreFilters,
    updateSelectedConditionFilters,
    updateSelectedFoilFilters,
    updateSelectedRarityFilters,
    updateSelectedSetFilters,
    atLeastOneFilter,
    resetAllFilters
  } = useBuyListStore();

  return (
    <>
      {mobile == true ? (
        <>
          <Sheet>
            <SheetTrigger asChild={true} className="w-full">
              <Button className="relative flex w-full items-center justify-center">
                <p className="absolute left-1/2 -translate-x-1/2 transform">
                  Open Filters
                </p>
                <MixerHorizontalIcon className="ml-auto h-5 w-5  " />
              </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className="w-svw  sm:max-w-full">
              <SheetHeader>
                <SheetTitle className="text-left text-3xl font-medium">
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 grid gap-y-2">
                <FilterDropDownMultiple
                  values={dummyStoreData}
                  filterName={'Store'}
                  setFilterFunction={updateSelectedStoreFilters}
                  selectedZustandFilters={selectedStoreFilters}
                />
                <FilterDropDownMultiple
                  values={dummyConditionData}
                  filterName={'Condition'}
                  setFilterFunction={updateSelectedConditionFilters}
                  selectedZustandFilters={selectedConditionFilters}
                />
                <FilterDropDownMultiple
                  values={dummyFoilData}
                  filterName={'Foil'}
                  setFilterFunction={updateSelectedFoilFilters}
                  selectedZustandFilters={selectedFoilFilters}
                />
                <FilterDropDownMultiple
                  values={dummyRarityData}
                  filterName={'Rarity'}
                  setFilterFunction={updateSelectedRarityFilters}
                  selectedZustandFilters={selectedRarityFilters}
                />
                <FilterDropDownMultiple
                  values={dummySetData}
                  filterName={'Set'}
                  setFilterFunction={updateSelectedSetFilters}
                  selectedZustandFilters={selectedSetFilters}
                />

                <Button className="text-md mt-6 h-9 rounded-sm  font-semibold ">
                  Apply Filters
                </Button>

                <Button
                  disabled={atLeastOneFilter ? false : true}
                  onClick={() => {
                    resetAllFilters();
                  }}
                  className={`text-md mt-2 h-9 rounded-sm bg-red-600  font-semibold  `}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Select>
            <SelectTrigger className=" border-border-colour  mx-auto  w-full bg-popover focus:ring-0 focus:ring-offset-0 ">
              <SelectValue placeholder="Sort By:A-Z" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By:</SelectLabel>
                <SelectItem value="test">Sort By:A-Z</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <div className="mx-auto flex w-full justify-between">
            <FilterDropDownMultiple
              values={dummyStoreData}
              filterName={'Store'}
              setFilterFunction={updateSelectedStoreFilters}
              selectedZustandFilters={selectedStoreFilters}
            />
            <FilterDropDownMultiple
              values={dummyConditionData}
              filterName={'Condition'}
              setFilterFunction={updateSelectedConditionFilters}
              selectedZustandFilters={selectedConditionFilters}
            />
            <FilterDropDownMultiple
              values={dummyFoilData}
              filterName={'Foil'}
              setFilterFunction={updateSelectedFoilFilters}
              selectedZustandFilters={selectedFoilFilters}
            />
            <FilterDropDownMultiple
              values={dummyRarityData}
              filterName={'Rarity'}
              setFilterFunction={updateSelectedRarityFilters}
              selectedZustandFilters={selectedRarityFilters}
            />
            <FilterDropDownMultiple
              values={dummySetData}
              filterName={'Set'}
              setFilterFunction={updateSelectedSetFilters}
              selectedZustandFilters={selectedSetFilters}
            />
          </div>
          <div className="flex">
            <div className="mt-4 flex w-full ">
              <Button className=" h-8 rounded-sm text-sm font-semibold sm:w-[180px]">
                Apply Filters
              </Button>
              <Button
                disabled={atLeastOneFilter ? false : true}
                onClick={() => {
                  resetAllFilters();
                }}
                className={`ml-2 h-8  rounded-sm  bg-red-600 font-semibold  sm:w-[180px]`}
              >
                Reset Filters
              </Button>
            </div>
            <div className="mt-4 flex w-full justify-end ">
              <Select>
                <SelectTrigger className="border-border-colour h-8 bg-popover focus:ring-0 focus:ring-offset-0 sm:w-[180px]">
                  <SelectValue placeholder="Sort By:A-Z" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By:</SelectLabel>
                    <SelectItem value="test">Sort By:A-Z</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </>
  );
}
