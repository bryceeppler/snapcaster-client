import React from 'react';
import { useStore } from '@/stores/store';
import SingleCatalogRow from './SingleCatalogRow';
import SingleCatalogCard from './SingleCatalogCard';
import SingleResultsTable from './single-results-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackToTopButton from './back-to-top-btn';
type Props = {};

export default function SingleCatalog({}: Props) {
  const { filteredSingleSearchResults } = useStore();
  if (filteredSingleSearchResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {filteredSingleSearchResults.map((cardData, index) => (
            <SingleCatalogRow cardData={cardData} key={index} />
          ))}
        </TabsContent>
        <TabsContent value="catalog">
          {' '}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredSingleSearchResults.map((cardData, index) => (
              <SingleCatalogCard cardData={cardData} key={index} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <SingleResultsTable cardData={filteredSingleSearchResults} />
        </TabsContent>
      </Tabs>
      <BackToTopButton />
    </div>
  );
}
