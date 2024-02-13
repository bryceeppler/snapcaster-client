import React from 'react'

type Props = {}

export default function Homebanner({}: Props) {
  return (
    <div className="">
      {" "}
      <img
        className="w-24 mx-auto hidden sm:flex z-30"
        src="/logo-small.svg"
        alt="snapcaster logo"
      />

      {/* <div className="text-6xl font-bold bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700 text-transparent">
        <a href="https://snapcaster.ca">snapcaster</a>
      </div> */}
      <p className="text-3xl font-extrabold mt-2">Snapcaster</p>
      <p className="text-md text-gray-400">Get started by searching for a card.</p>

    </div>
  )
}