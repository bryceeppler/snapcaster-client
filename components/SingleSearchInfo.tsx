import React from "react";
import { useStore } from "@/stores/store";

type Props = {};

export default function SingleSearchinfo({}: Props) {
  const {
    singleSearchResults,
    filteredSingleSearchResults,
    singleSearchQuery,
  } = useStore();
  return (
    <div className="flex w-full flex-col items-center justify-center p-2">
      <div>
        {singleSearchResults.length != filteredSingleSearchResults.length ? (
          <div className="text-sm">
            <>
            Displaying {filteredSingleSearchResults.length} of{" "}
            {singleSearchResults.length} results for &quot;{singleSearchQuery}
            &quot;
            </>
          </div>
        ) : (
          <div className="text-sm ">
            <>
            {singleSearchResults.length} results for &quot;{singleSearchQuery}
            &quot;
            </>
          </div>
        )}
      </div>
    </div>
  );
}
