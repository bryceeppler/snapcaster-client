import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import CartStoreAccordian from './cart-store-accordian';
import FilterDropDownMultiple from './filter-drop-down-multiple';
import useBuyListStore from '@/stores/buyListStore';
// const dummyStoreData: any = [
//   { key: 'obsidian', value: 'Obsidian Games' },
//   { key: 'chimera', value: 'Chimera Gaming' },
//   { key: 'levelup', value: 'Level Up Games' },
//   { key: 'exorgames', value: 'Exor Games' },
//   { key: 'mythicstore', value: 'The Mythic Store' }
// ];
// const dummyConditionData: any = [
//   { key: 'nm', value: 'Near Mint' },
//   { key: 'lp', value: 'Lightly Played' },
//   { key: 'mp', value: 'Moderetly Played' },
//   { key: 'hp', value: 'Heavily Played' },
//   { key: 'dmg', value: 'Damaged' }
// ];

// const dummyFoilData: any = [
//   { key: 'foil', value: 'Foil' },
//   { key: 'nonfoil', value: 'Non Foil' }
// ];

// const dummyRarityData: any = [
//   { key: 'common', value: 'Common' },
//   { key: 'uncommon', value: 'Uncommon' },
//   { key: 'rare', value: 'Rare' },
//   { key: 'mythicrare', value: 'Mythic Rare' }
// ];

// const dummySetData: any = [
//   { key: 'modernhorizons2', value: 'Modern Horizons 2' },
//   { key: 'modernhorizons3', value: 'Modern Horizons 3' }
// ];

type Props = { mobile: boolean };

export default function BuyListFilterContainer({ mobile }: Props) {
  const {
    dummyStoreData,
    dummyConditionData,
    dummyFoilData,
    dummyRarityData,
    dummySetData
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
                <TriangleRightIcon className="ml-auto h-8 w-8  pr-2" />
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
                />
                <FilterDropDownMultiple
                  values={dummyConditionData}
                  filterName={'Condition'}
                />
                <FilterDropDownMultiple
                  values={dummyFoilData}
                  filterName={'Foil'}
                />
                <FilterDropDownMultiple
                  values={dummyRarityData}
                  filterName={'Rarity'}
                />
                <FilterDropDownMultiple
                  values={dummySetData}
                  filterName={'Set'}
                />

                <Button className="text-md mt-6 h-9 rounded-sm  font-semibold ">
                  Search
                </Button>
                <Button className="text-md mt-2 h-9 rounded-sm bg-[#FFF7F7] font-semibold text-red-300">
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
        <div className="flex">
          <FilterDropDownMultiple
            values={dummyStoreData}
            filterName={'Store'}
          />
          <FilterDropDownMultiple
            values={dummyConditionData}
            filterName={'Condition'}
          />
          <FilterDropDownMultiple values={dummyFoilData} filterName={'Foil'} />
          <FilterDropDownMultiple
            values={dummyRarityData}
            filterName={'Rarity'}
          />
          <FilterDropDownMultiple values={dummySetData} filterName={'Set'} />
        </div>
      )}
    </>
  );
}
