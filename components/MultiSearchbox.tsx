import React from 'react'
import { useStore } from '@/store'

type Props = {}

export default function MultiSearchbox({}: Props) {
    const { multiSearchQuery, multiSearchInput, setMultiSearchInput } = useStore()
  return (
    <div className="flex flex-col w-full justify-center">
      <div className="mt-3 w-full">
        <label
          htmlFor="multisearchFormControlTextarea1"
          className="font-bold form-label inline-block mb-2 "
        >
          Cards to search
        </label>
        <textarea
          className="
          form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          bg-gray-800 bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
        focus:text-white focus:bg-black focus:border-pink-600 focus:outline-none
        "
          id="multisearchFormControlTextarea1"
          rows={10}
          placeholder={`Enter card names, one per line (max 100 lines)
1 Ajani's Chosen
1 Arcane Signet
Dockside Extortionist
Counterspell`}
          value={multiSearchInput}
          onChange={(e) => setMultiSearchInput(e.target.value)}
        ></textarea>
      </div>
      <button
        className="
            bg-pink-600
            hover:bg-pink-700
            text-white
            font-bold
            py-2
            px-4
            rounded
            focus:outline-none
            focus:shadow-outline
            mt-4
            mx-auto
          "
        type="button"
        // onClick={() => store.handleSubmit()}
      >
        Search
      </button>
    </div>  )
}