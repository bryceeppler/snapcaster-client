/**
 * v0 by Vercel.
 * @see https://v0.dev/t/imAWHLrtjsE
 */

export default function Component() {
  return (
    <section className="flex h-screen w-full flex-col items-center space-y-8 px-4 text-center">
      <div className="p-8" />
      <svg
        className=" h-24 w-24 text-red-500 dark:text-red-400"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
      <h2 className="text-4xl font-semibold text-gray-300 dark:text-white">
        Checkout cancelled
      </h2>
      <p className="text-xl text-gray-400 dark:text-gray-300">
        Your checkout session has been cancelled. You can continue the checkout
        process whenever you're ready.
      </p>
      {/* <Button variant="slim">
        <Link className="" href="/">
          Return to Homepage
        </Link>
      </Button> */}
    </section>
  );
}
