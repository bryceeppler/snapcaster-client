import React from 'react';
import useSingleStore from '@/stores/singleSearchStore';

type Props = {};

export default function SingleSearchinfo({}: Props) {
  const { results, searchQuery, filteredResults } = useSingleStore();
  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <div>
        {results.length != filteredResults.length ? (
          <div className="text-sm">
            <>
              Displaying {filteredResults.length} of {results.length} results
              for &quot;{searchQuery}
              &quot;
            </>
          </div>
        ) : (
          <div className="text-sm ">
            <>
              {results.length} results for &quot;
              {searchQuery}
              &quot;
            </>
          </div>
        )}
      </div>
    </div>
  );
}
