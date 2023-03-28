import React from 'react';
import Head from 'next/head';

type Props = {};

export default function About({}: Props) {
  const openDonationLink = () => {
    window.open(
      'https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=Thank+you+for+supporting+snapcaster%21+Your+generosity+keeps+snapcaster+running+by+covering+server+costs.&currency_code=CAD',
      '_blank'
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
      <main className="flex min-h-screen flex-col items-center justify-between px-2 py-8 sm:p-8">
        <div className="max-w-xl flex-1 flex-col items-center justify-center text-left">
          <div className="mx-auto space-y-7">
            <h1 className="text-center text-4xl font-extrabold text-white">
              About
            </h1>

            <div className="rounded-md p-4 outline outline-1 outline-zinc-600 backdrop-blur backdrop-brightness-50 space-y-8">
              <div>
              <div className="text-pink-400">Welcome to snapcaster!</div>
                <p className="my-4">
                  This is a project that I created to
                  help Magic: The Gathering players search for singles on
                  Canadian websites. With snapcaster, you can search multiple
                  websites at once and see all the results in one place. If you
                  have any suggestions or feedback, please feel free to email me
                  at epplerdev@gmail.com.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-pink-500">
                  Support
                </h2>
                <p className="mt-4">
                  snapcaster is a service I created in my spare time, and I rely
                  on donations to cover the server costs. If you find snapcaster
                  helpful, please consider donating to support the project.
                </p>
                <div className="flex justify-center mt-4">
                <button
                  className="rounded-md bg-pink-400 py-2 px-4 font-mono font-bold transition-colors first-letter:mt-4 hover:bg-pink-500"
                  onClick={openDonationLink}
                >
                  Donate with PayPal
                </button>
              </div>
            </div>
                <p className="mt-4">
                  If you're interested in contributing to the development of
                  snapcaster, you can contact me at the same email address.
                </p>

              </div>

          </div>
        </div>
      </main>
    </>
  );
}
