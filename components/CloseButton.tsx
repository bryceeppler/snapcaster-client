import React from 'react';

type Props = {
  onClick: () => void;
};

export default function CloseButton({ onClick }: Props) {
  return (
    <div>
      {/* White circle with pink shadow */}
      <div className="flex items-center justify-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600 text-zinc-600 transition-colors hover:bg-white"
          onClick={onClick}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 transition-all hover:text-white">
            <svg
              className="mx-auto h-4 w-4 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
