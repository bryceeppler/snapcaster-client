import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Input } from '../ui/input';
import SingleFilterAccordian from './single-filter-accordian';
import { useStore } from '@/stores/store';
import useSingleStore from '@/stores/singleSearchStore';
import { SetStateAction } from 'react';

export default function FilterDropdown() {
  const { websites } = useStore();
  const { filters, setFilters, applyFilters, clearFilters } = useSingleStore();
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="filters" className="border-b-0">
          <AccordionTrigger className="h-10 shrink-0 rounded-md border-2 bg-background px-3 text-base font-normal hover:bg-accent">
            Filters
          </AccordionTrigger>
          <AccordionContent className="absolute left-0 z-20 my-2 w-full bg-background shadow-md">


            <Accordion type="single" collapsible className="pb-4">
              <AccordionItem value="condition">
                <AccordionTrigger className="text-base">
                  Condition
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={filters.conditions.includes('NM')}
                        onCheckedChange={() =>
                          // partial update on filters.conditions to toggle NM
                          setFilters({
                              ...filters,
                              conditions: filters.conditions.includes('NM')
                                ? filters.conditions.filter(
                                    (c: string) => c !== 'NM'
                                  )
                                : [...filters.conditions, 'NM']
                            })
                        }
                      />
                      NM
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={filters.conditions.includes('LP')}
                        onCheckedChange={() =>
                          setFilters({
                              ...filters,
                              conditions: filters.conditions.includes('LP')
                                ? filters.conditions.filter(
                                    (c: string) => c !== 'LP'
                                  )
                                : [...filters.conditions, 'LP']
                            })
                        }
                      />
                      LP
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={filters.conditions.includes('MP')}
                        onCheckedChange={() =>
                          setFilters({
                              ...filters,
                              conditions: filters.conditions.includes('MP')
                                ? filters.conditions.filter(
                                    (c: string) => c !== 'MP'
                                  )
                                : [...filters.conditions, 'MP']
                            })
                        }
                      />
                      MP
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={filters.conditions.includes('HP')}
                        onCheckedChange={() =>
                          setFilters({
                              ...filters,
                              conditions: filters.conditions.includes('HP')
                                ? filters.conditions.filter(
                                    (c: string) => c !== 'HP'
                                  )
                                : [...filters.conditions, 'HP']
                            })
                        }
                      />
                      HP
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={filters.conditions.includes('DMG')}
                        onCheckedChange={() =>
                          setFilters({
                              ...filters,
                              conditions: filters.conditions.includes('DMG')
                                ? filters.conditions.filter(
                                    (c: string) => c !== 'DMG'
                                  )
                                : [...filters.conditions, 'DMG']
                            })
                        }
                      />
                      DMG
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem value="price">
                <AccordionTrigger className="text-base">Price</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 p-2">
                      <Input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          handleFilterChange('priceRange', [
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value),
                            filters.priceRange[1]
                          ])
                        }
                        onBlur={(e) =>
                          handleFilterChange('priceRange', [
                            e.target.value === ''
                              ? 0
                              : parseInt(e.target.value),
                            filters.priceRange[1]
                          ])
                        }
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          handleFilterChange('priceRange', [
                            filters.priceRange[0],
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value)
                          ])
                        }
                        onBlur={(e) =>
                          handleFilterChange('priceRange', [
                            filters.priceRange[0],
                            e.target.value === ''
                              ? 10000
                              : parseInt(e.target.value)
                          ])
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {(tcg === 'pokemon' ||
                tcg === 'lorcana' ||
                tcg === 'yugioh' ||
                tcg === 'onepiece') && (
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="collector_number"
                  header="Collector Number"
                  handleFilterChange={handleFilterChange}
                />
              )}
              {tcg != 'pokemon' && (
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="foil"
                  header={tcg == 'yugioh' ? 'Rarity' : 'Foil'}
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
              )}

              {tcg == 'mtg' && (
                <>
                  <SingleFilterAccordian
                    filters={filters}
                    filterOption="frame"
                    header="Frame"
                    handleFilterChange={handleFilterChange}
                  ></SingleFilterAccordian>
                  <SingleFilterAccordian
                    filters={filters}
                    filterOption="showcase"
                    header="Showcase"
                    handleFilterChange={handleFilterChange}
                  ></SingleFilterAccordian>
                  <SingleFilterAccordian
                    filters={filters}
                    filterOption="alternate_art"
                    header="Alternate Art"
                    handleFilterChange={handleFilterChange}
                  ></SingleFilterAccordian>
                  <SingleFilterAccordian
                    filters={filters}
                    filterOption="promo"
                    header="Promo"
                    handleFilterChange={handleFilterChange}
                  ></SingleFilterAccordian>
                  <SingleFilterAccordian
                    filters={filters}
                    filterOption="art_series"
                    header="Art Series"
                    handleFilterChange={handleFilterChange}
                  ></SingleFilterAccordian>
                </>
              )}
              <SingleFilterAccordian
                filters={filters}
                filterOption="set"
                header="Set"
                handleFilterChange={handleFilterChange}
              ></SingleFilterAccordian>
              <AccordionItem value="vendor">
                <AccordionTrigger className="text-base">
                  Vendor
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="flex max-h-[200px] flex-col overflow-y-auto">
                    <div className="grid gap-2">
                      {websites
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((website) => (
                          <Label
                            key={website.slug}
                            className="flex items-center gap-2 font-normal"
                          >
                            <Checkbox
                              checked={filters.vendor.includes(website.slug)}
                              onCheckedChange={() =>
                                handleFilterChange(
                                  'vendor',
                                  filters.vendor.includes(website.slug)
                                    ? filters.vendor.filter(
                                        (v: string) => v !== website.slug
                                      )
                                    : [...filters.vendor, website.slug]
                                )
                              }
                            />
                            {website.name}
                          </Label>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />{' '}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
              <Button
                onClick={() => {
                  applyFilters();
                }}
              >Apply Filters</Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
              >
                Clear Filters
              </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
