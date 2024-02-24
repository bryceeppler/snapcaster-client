export default function Component() {
    return (
      <section className="w-full h-screen flex flex-col items-center px-4 text-center space-y-8">
      <svg
          className=" h-24 w-24 text-red-500 dark:text-red-400 mt-20"
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
        <h2 className="text-4xl font-semibold text-gray-300 dark:text-white">Your email could not be verified.</h2>
        <p className="text-xl text-gray-400 dark:text-gray-300">
          Your email verification was not successful.
        </p>
        {/* <Button variant="slim">
          <Link className="" href="/">
            Return to Homepage
          </Link>
        </Button> */}
      </section>
    )
  }
  
  