import React, { useState } from 'react';
import { useStore } from '@/stores/store';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
type Props = {
  hasActiveSubscription: boolean;
};

const parseMultiSearchInput = (input: string, numAllowedLines: number) => {
  const lines = input.split(/\n/);
  let count = 0;
  let returnString = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // if the line is empty, skip it
    if (line === '') continue;

    if (count < numAllowedLines) {
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

export default function MultiSearchbox({ hasActiveSubscription }: Props) {
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
          Enter card names, one per line{' '}
          {hasActiveSubscription ? '(max 100 lines)' : '(max 5 lines)'}
        </div>
        <Textarea
          className={`bg-clip-padding
          sm:text-sm
        `}
          id="multisearchFormControlTextarea1"
          rows={6}
          placeholder={`Enter card names, one per line ${
            hasActiveSubscription ? '(max 100 lines)' : '(max 5 lines)'
          }
1 Ajani's Chosen
1 Arcane Signet
Dockside Extortionist
Counterspell`}
          value={multiSearchInput}
          onChange={(e) => {
            setMultiSearchInput(e.target.value);
            // if hasActiveSubscription is true, set warning to true if the number of lines is greater than 100. Otherwise, set warning to true if the number of lines is greater than 5
            if (hasActiveSubscription) {
              setWarning(e.target.value.split(/\n/).length > 100);
            } else {
              setWarning(e.target.value.split(/\n/).length > 5);
            }
          }}
        ></Textarea>
        {warning && <div className="mt-2 text-red-600">Max 5 cards</div>}
      </div>
      <div className="p-3" />
      <Button
        className="disabled:cursor-not-allowed"
        type="button"
        disabled={multiSearchInput === '' || warning}
        // onClick={() => store.handleSubmit()}
        onClick={() => {
          const numAllowedLines = hasActiveSubscription ? 100 : 5;
          const result = parseMultiSearchInput(
            multiSearchInput,
            numAllowedLines
          );
          fetchMultiSearchResults(result);
        }}
      >
        Search
      </Button>
    </div>
  );
}
