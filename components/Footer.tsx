import React from 'react'

type Props = {}

export default function Footer({}: Props) {
  return (
    <div
      className="flex flex-row justify-center items-center
      bg-zinc-900
      text-zinc-100
      text-sm
      p-2
      "
    >
      <div className="flex flex-row space-x-2">
        <div className="text-zinc-100">
          Created by {" "}
          <a
            href="https://www.bryceeppler.com"
            target="_blank"
            rel="noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Bryce Eppler
          </a>
        </div>
        </div>
    </div>
  )
}