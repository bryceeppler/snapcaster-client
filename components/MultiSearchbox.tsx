import React, {useState} from 'react';
import { useStore } from '@/stores/store';

type Props = {};

const parseMultiSearchInput = (input: string) => {
  const lines = input.split(/\n/);
  let count = 0;
  let returnString = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // if the line is empty, skip it
    if (line === '') continue;

    if (count < 5) {
      // remove any numbers from the start of the line
      const lineWithoutCount = line.replace(/^\d+/, '');
      // remove any whitespace from the start of the line
      const lineWithoutCountAndWhitespace = lineWithoutCount.replace(
        /^\s+/,
        ''
      );
      // remove any whitespace from the end of the line
      const lineWithoutCountAndWhitespaceAndTrailingWhitespace =
        lineWithoutCountAndWhitespace.replace(/\s+$/, '');
      // add the line to the return string
      // if the length > 0, add to the return string
      if (lineWithoutCountAndWhitespaceAndTrailingWhitespace.length > 0) {
        returnString +=
          lineWithoutCountAndWhitespaceAndTrailingWhitespace + '\n';
        count++;
      }
    }
  }

  return returnString;
};

export default function MultiSearchbox({}: Props) {
  const {
    multiSearchQuery,
    multiSearchInput,
    setMultiSearchInput,
    fetchMultiSearchResults
  } = useStore();
  const [warning, setWarning] = useState(false);

  return (
    <div className="mb-4 flex w-full flex-col justify-center">
      <div className="mt-3 w-full">
        <div className="mb-2 text-sm text-gray-400">
          Enter card names, one per line (max 5 lines)
        </div>
        <textarea
          className="
          form-control
          m-0
          block
          w-full
          rounded
          border
          border-solid
          border-zinc-300 bg-zinc-900
          bg-clip-padding px-3 py-1.5
          text-base
          font-normal
          transition
          ease-in-out
        focus:border-pink-600 focus:bg-black focus:text-white focus:outline-none
        "
          id="multisearchFormControlTextarea1"
          rows={6}
          placeholder={`Enter card names, one per line (max 5 lines)
1 Ajani's Chosen
1 Arcane Signet
Dockside Extortionist
Counterspell`}
          value={multiSearchInput}
          onChange={(e) => {
            setMultiSearchInput(e.target.value);
            setWarning(e.target.value.split(/\n/).filter(line => line.trim() !== '').length > 5);
          }}
        ></textarea>
                {warning && <div className="text-red-600 mt-2">Warning: Max 5 lines allowed!</div>}

      </div>
      <button
        className="
            focus:shadow-outline
            mx-auto
            mt-4
            rounded
            bg-pink-600
            py-2
            px-4
            font-bold
            text-white
            hover:bg-pink-700
            focus:outline-none
            disabled:bg-gray-500
            disabled:cursor-not-allowed
          "
        type="button"
        disabled={multiSearchInput === '' || warning}
        // onClick={() => store.handleSubmit()}
        onClick={() => {
          const result = parseMultiSearchInput(multiSearchInput);
          fetchMultiSearchResults(result);
        }}
      >
        Search
      </button>
    </div>
  );
}
