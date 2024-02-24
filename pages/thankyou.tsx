export default function Component() {
  return (
    <section className="w-full h-screen flex flex-col items-center px-4 text-center space-y-8">
            <div className="p-8"/>

      <svg
        className=" w-24 h-24 text-green-500 dark:text-green-300"
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <h2 className="text-4xl font-semibold text-gray-300 dark:text-white">Thank you for your subscription!</h2>
      <p className="text-xl text-gray-400 dark:text-gray-300">
        Your payment was successful and your subscription is now active.
      </p>
      {/* <Button variant="slim">
        <Link className="" href="/">
          Return to Homepage
        </Link>
      </Button> */}
    </section>
  )
}

