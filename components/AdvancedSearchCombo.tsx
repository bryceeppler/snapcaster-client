import React, { useState } from 'react';
import { useOutsideClick } from '@/stores/advancedStore';
import { Filter } from '@/stores/advancedStore';
import { Button } from './ui/button';

type PropsOption = {
  option: Filter[];
  label: string;
  selectedList: string[];
  selectCount: number;
  toggle(field: string, category: string): void;
};

export default function AdvancedSearchCombo(props: PropsOption) {
  const [open, setOpen] = React.useState(false);

  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    props.option.reduce(
      (obj, state) => ({ ...obj, [state.abbreviation]: false }),
      {}
    )
  );
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  return (
    <div ref={ref}>
      <div className="relative space-y-1">
        <div className="min-h-14 grid">
          <label className="text-midTone  truncate pb-1 text-sm">
            <div className="flex">
              <p className="font-medium">{props.label}</p>
              <p className="pl-1 text-green-600">
                {props.selectCount > 0 ? `+${props.selectCount}` : ''}
              </p>
            </div>
          </label>
          <Button
            type="button"
            className="h-7  w-full overflow-hidden pl-2"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <span className="w-full truncate pl-2 text-left text-xs">
              {props.selectedList.length > 0 ? `${props.selectedList}` : 'Any'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </Button>
        </div>
        {open && (
          <div className="no-scrollbar absolute z-10 max-h-52 w-max min-w-full overflow-y-auto rounded-md bg-zinc-900 shadow-2xl ">
            {props.option.map((state) => (
              <div key={state.abbreviation}>
                <fieldset className={` grid grid-cols-1 `}>
                  <div className="flex hover:bg-zinc-600 ">
                    <input
                      id={`input-${state.abbreviation}`}
                      type="checkbox"
                      onChange={(e) => {
                        setSelectedFields({
                          ...selectedFields,
                          [state.abbreviation]: e.target.checked
                        });
                        props.toggle(state.abbreviation, props.label);
                      }}
                      checked={props.selectedList.includes(state.abbreviation)}
                      className={
                        'm-auto mx-1 aspect-square h-2 w-2 cursor-pointer appearance-none rounded-full ' +
                        (props.selectedList.includes(state.abbreviation)
                          ? ' bg-pink-600'
                          : 'bg-zinc-600')
                      }
                    />
                    <label
                      htmlFor={`input-${state.abbreviation}`}
                      className="w-full cursor-pointer px-1 text-[13px]"
                    >
                      {state.name}
                    </label>
                  </div>
                </fieldset>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
