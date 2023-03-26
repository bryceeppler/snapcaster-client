import React from 'react'
import Head from 'next/head'

type Props = {}

export default function About({}: Props) {
    const openDonationLink = () => {
        window.open(
          "https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=Thank+you+for+supporting+snapcaster%21+Your+generosity+keeps+snapcaster+running+by+covering+server+costs.&currency_code=CAD",
          "_blank"
        );
      };
      return (
        <>
          <Head>
            <title>About - snapcaster</title>
            <meta
              name="description"
              content="Search Magic the Gathering singles in Canada"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col justify-between items-center px-2 py-8 sm:p-8 min-h-screen">
            <div className="flex-col items-center justify-center flex-1 text-left max-w-xl">
              <div className="mx-auto space-y-7">
                <div>
                  <h1 className="text-4xl font-extrabold text-pink-500 text-center">About</h1>
                  <p className="mt-4">
                  Welcome to Snapcaster! This is a project that I created to help Magic: The Gathering players search for singles on Canadian websites. With Snapcaster, you can search multiple websites at once and see all the results in one place. If you have any suggestions or feedback, please feel free to email me at epplerdev@gmail.com.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-pink-500">Support</h2>
                  <p className="mt-4">
                  If you're interested in contributing to the development of Snapcaster, you can contact me at the same email address.
                  </p>
                  <p className="mt-4">
                    Snapcaster is a service I created in my spare time, and I rely on donations to cover the server costs. If you find Snapcaster helpful, please consider donating to support the project.
                  </p>
                </div>
                <div className="flex justify-center">
                <button className="bg-pink-400 first-letter:mt-4 py-2 px-4 rounded-md font-mono font-bold hover:bg-pink-500 transition-colors" onClick={openDonationLink}>
                    Donate with PayPal
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-pink-500">Privacy</h2>
                  <p className="mt-4">
                    I currently log any search queries and store them in a database
                    for debugging and basic analytics. I do not share this data with
                    anyone.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </>
      );
}