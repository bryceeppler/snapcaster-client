import React from 'react'
import {useStore} from 'store'
import SingleCatalogRow from './SingleCatalogRow'
type Props = {}

export default function SingleCatalog({}: Props) {
  const {filteredSingleSearchResults} = useStore()
  if (filteredSingleSearchResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    )
  }

  return (
    <div>
      {filteredSingleSearchResults.map((cardData, index) => (
        <SingleCatalogRow cardData={cardData} key={index} />
      ))}
      {/* if cardData is longer than 10, have a back to top button */}
      {filteredSingleSearchResults.length > 10 && (
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