import React from 'react'
import { useStore } from '@/store'
type Props = {}
import MultiCatalogRow from './MultiCatalogRow'
import MultiSearchResultsInfo from './MultiSearchResultsInfo'

export default function MultiCatalog({}: Props) {
    const {filteredMultiSearchResults} = useStore()
    if (filteredMultiSearchResults.length === 0) {
      return (
        <div className="flex items-center justify-center pt-5">
          <div className="text-sm">No results found</div>
        </div>
      )
    }
  
    return (
      <div>
        <MultiSearchResultsInfo />
        {filteredMultiSearchResults.map((cardData, index) => (
          <MultiCatalogRow cardData={cardData} key={index} />
        ))}
        {/* if cardData is longer than 10, have a back to top button */}
        {filteredMultiSearchResults.length > 10 && (
          <button
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            className="btn-small mt-4"
          >
            Back to Top
          </button>
        )}
      </div>  )
  }