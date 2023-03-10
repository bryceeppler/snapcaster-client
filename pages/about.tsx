import React from 'react'
import Head from 'next/head'

type Props = {}

export default function About({}: Props) {
    const openDonationLink = () => {
        window.open(
          "https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=Thank+you+for+donating+to+snapcaster%2C+I+really+appreciate+your+support+%3A%29&currency_code=CAD",
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
          <main className="flex flex-col justify-between items-center p-8 min-h-screen">
            <div className="flex-col items-center justify-center flex-1 text-left max-w-xl">
              <div className="mx-auto space-y-7">
                <div>
                  <h1 className="text-3xl font-bold text-purple-500 text-center">About</h1>
                  <p className="mt-4">
                    Snapcaster allows you to search for Magic: The Gathering singles
                    listed on Canadian websites. It will search all the websites for
                    you and display the results in one place. If you have any
                    suggestions or requests, let me know at epplerdev@gmail.com.
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-500">Support</h2>
                  <p className="mt-4">
                    If you would like to help with development, contact me at
                    epplerdev@gmail.com or submit a pull request on GitHub.
                  </p>
                  <p className="mt-4">
                    Snapcaster is a free service I have been working on in my spare
                    time. If you would like to support the project, please consider
                    donating to help with the server costs.
                  </p>
                </div>
                <div className="flex justify-center">
                <button className="bg-gray-300 first-letter:mt-4 py-1 px-2 rounded-md" onClick={openDonationLink}>
                    Donate
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-500">Privacy</h2>
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