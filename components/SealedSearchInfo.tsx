import React from 'react'
import { useStore } from '@/store'

type Props = {}

export default function SealedSearchInfo({}: Props) {
    const { filteredSealedSearchResults : results, sealedSearchQuery, sealedSearchResults:resultsRaw } = useStore()
  return (
    <div className="flex flex-col justify-center items-center w-full p-2">
    { resultsRaw.length != results.length ? (
      <p className="text-sm ">
        Displaying {results.length} of {resultsRaw.length} results for &quot;{sealedSearchQuery}&quot;
      </p>
    ) : (
      <p className="text-sm ">
        {results.length} results for &quot;{sealedSearchQuery}&quot;
      </p>
    )}
  </div>
  )
}