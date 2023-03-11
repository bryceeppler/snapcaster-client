import React from 'react'

type Props = {}

export default function Homebanner({}: Props) {
  return (
    <div className="pt-24">
      {" "}
      <img
        className="w-24 mx-auto hidden sm:flex"
        src="/logo-small.svg"
        alt="snapcaster logo"
      />

      {/* <div className="text-6xl font-bold bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700 text-transparent">
        <a href="https://snapcaster.ca">snapcaster</a>
      </div> */}
      <p className="mt-5 text-3xl font-extrabold">Get started by searching for a card </p>
    </div>
  )
}