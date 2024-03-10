import React from 'react';
import { advancedUseStore } from '@/stores/advancedStore';

type Props = {
  title: string;
  value: string;
  checkedState: boolean;
};

export default function AdvancedCheckBox(props: Props) {
  return (
    <div
      className="min-h-14 flex cursor-pointer items-end "
      onClick={() => {
        advancedUseStore.getState().toggleRegularCheckboxes(props.value);
      }}
    >
      <div className="flex h-7 w-full items-center rounded-md bg-zinc-800 px-2 py-1 hover:bg-zinc-700">
        <input
          id="numberCheckBox"
          checked={props.checkedState}
          type="checkbox"
          onClick={() => {
            advancedUseStore.getState().toggleRegularCheckboxes(props.value);
          }}
          onChange={(e) => {}}
          className={
            'm-auto mx-1 aspect-square h-[10px] w-[10px] cursor-pointer appearance-none rounded-full ' +
            (props.checkedState == true ? ' bg-pink-600' : 'bg-zinc-600')
          }
        />
        <p className=" w-full cursor-pointer pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {props.title}
        </p>
      </div>
    </div>
  );
}
