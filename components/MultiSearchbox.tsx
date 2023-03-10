import React from 'react'
import { useStore } from '@/store'

type Props = {}

const parseMultiSearchInput = (input: string) => {
  const lines = input.split(/\n/)

  let returnString = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // if the line is empty, skip it
    if (line === '') continue
    // if the line is a number, skip it
    if (!isNaN(parseInt(line))) continue
    // remove any numbers from the start of the line
    const lineWithoutCount = line.replace(/^\d+/, '')
    // remove any whitespace from the start of the line
    const lineWithoutCountAndWhitespace = lineWithoutCount.replace(/^\s+/, '')
    // remove any whitespace from the end of the line
    const lineWithoutCountAndWhitespaceAndTrailingWhitespace = lineWithoutCountAndWhitespace.replace(/\s+$/, '')
    // add the line to the return string
    // if the length > 0, add to the return string
    if (lineWithoutCountAndWhitespaceAndTrailingWhitespace.length > 0) {
      returnString += lineWithoutCountAndWhitespaceAndTrailingWhitespace + '\n'
    }
  }
  console.log(returnString)

  return returnString
  // const result = lines.map((line) => {
  //   // if the line is empty, return null
  //   if (line === '') return null
  //   // if the line is a number, return null
  //   if (!isNaN(parseInt(line))) return null
  //   // remove any numbers from the start of the line
  //   const lineWithoutCount = line.replace(/^\d+/, '')
  //   // remove any whitespace from the start of the line
  //   const lineWithoutCountAndWhitespace = lineWithoutCount.replace(/^\s+/, '')
  //   // remove any whitespace from the end of the line
  //   const lineWithoutCountAndWhitespaceAndTrailingWhitespace = lineWithoutCountAndWhitespace.replace(/\s+$/, '')
  //   // return the line
  //   return lineWithoutCountAndWhitespaceAndTrailingWhitespace
  // })
  // // filter out any null values
  // result.filter((line) => line !== null)
  // // join the lines with a newline
  // console.log(result.join('\n')
}


export default function MultiSearchbox({}: Props) {
    const { multiSearchQuery, multiSearchInput, setMultiSearchInput, fetchMultiSearchResults } = useStore()
  return (
    <div className="flex flex-col w-full justify-center">
      <div className="mt-3 w-full">
        <label
          htmlFor="multisearchFormControlTextarea1"
          className="font-bold text-lg form-label inline-block mb-2 "
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
          bg-zinc-900 bg-clip-padding
          border border-solid border-zinc-300
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
        onClick={() => {
          const result = parseMultiSearchInput(multiSearchInput)
          fetchMultiSearchResults(result)
        }}
      >
        Search
      </button>
    </div>  
    )
  }
  