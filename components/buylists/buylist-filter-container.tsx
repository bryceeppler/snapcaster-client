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
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import FilterDropDownMultiple from './filter-drop-down-multiple';
import useBuyListStore from '@/stores/buyListStore';

type Props = { mobile: boolean };

export default function BuyListFilterContainer({ mobile }: Props) {
  const {
    dummyFoilData,
    dummyRarityData,
    dummySetData,
    selectedFoilFilters,
    selectedRarityFilters,
    selectedSetFilters,

    updateSelectedFoilFilters,
    updateSelectedRarityFilters,
    updateSelectedSetFilters,
    atLeastOneFilter,
    resetAllFilters,
    updateSelectedSortBy,
    fetchCards
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
                <Select
                  onValueChange={(value) => {
                    updateSelectedSortBy(value);
                  }}
                >
                  <span className="flex-1">
                    <span className="flex">
                      <p className="text-sm">Sort By</p> &nbsp;
                    </span>
                    <SelectTrigger className="border-border-colour mx-auto h-8  w-full bg-popover text-sm focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Best Match" />
                    </SelectTrigger>
                  </span>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By:</SelectLabel>
                      <SelectItem value="best-match">Best Match</SelectItem>
                      <SelectItem value="name-asc">Name: A-Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z-A</SelectItem>
                      <SelectItem value="set-asc">Set: A-Z</SelectItem>
                      <SelectItem value="set-desc">Set: Z-A</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FilterDropDownMultiple
                  values={dummyFoilData[Object.keys(dummyFoilData)[0]]}
                  filterName={Object.keys(dummyFoilData)[0]}
                  setFilterFunction={updateSelectedFoilFilters}
                  selectedZustandFilters={selectedFoilFilters}
                />
                <FilterDropDownMultiple
                  values={dummyRarityData[Object.keys(dummyRarityData)[0]]}
                  filterName={Object.keys(dummyRarityData)[0]}
                  setFilterFunction={updateSelectedRarityFilters}
                  selectedZustandFilters={selectedRarityFilters}
                />
                <FilterDropDownMultiple
                  values={dummySetData[Object.keys(dummySetData)[0]]}
                  filterName={Object.keys(dummySetData)[0]}
                  setFilterFunction={updateSelectedSetFilters}
                  selectedZustandFilters={selectedSetFilters}
                />
                <Button
                  onClick={() => {
                    fetchCards();
                  }}
                  className="text-md mt-6 h-9 rounded-sm  font-semibold "
                >
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
        </>
      ) : (
        <>
          <div className="mx-auto flex w-full space-x-4">
            <FilterDropDownMultiple
              values={dummyFoilData[Object.keys(dummyFoilData)[0]]}
              filterName={Object.keys(dummyFoilData)[0]}
              setFilterFunction={updateSelectedFoilFilters}
              selectedZustandFilters={selectedFoilFilters}
            />
            <FilterDropDownMultiple
              values={dummyRarityData[Object.keys(dummyRarityData)[0]]}
              filterName={Object.keys(dummyRarityData)[0]}
              setFilterFunction={updateSelectedRarityFilters}
              selectedZustandFilters={selectedRarityFilters}
            />
            <FilterDropDownMultiple
              values={dummySetData[Object.keys(dummySetData)[0]]}
              filterName={Object.keys(dummySetData)[0]}
              setFilterFunction={updateSelectedSetFilters}
              selectedZustandFilters={selectedSetFilters}
            />
            <span className="mt-auto flex-1">
              <Select
                onValueChange={(value) => {
                  updateSelectedSortBy(value);
                }}
              >
                <span className="flex-1">
                  <span className="flex">
                    <p className="text-sm">Sort By</p> &nbsp;
                  </span>
                  <SelectTrigger className="border-border-colour mt-auto h-8 bg-popover focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Best Match" />
                  </SelectTrigger>
                </span>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    <SelectItem value="best-match">Best Match</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                    <SelectItem value="set-asc">Set: A-Z</SelectItem>
                    <SelectItem value="set-desc">Set: Z-A</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </span>
          </div>

          <div className="flex">
            <div className="mt-8 flex w-full ">
              <Button
                onClick={() => {
                  fetchCards();
                }}
                className=" h-8 rounded-sm text-sm font-semibold sm:w-[180px]"
              >
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
            <div className="mt-4 flex w-full justify-end "></div>
          </div>
        </>
      )}
    </>
  );
}
