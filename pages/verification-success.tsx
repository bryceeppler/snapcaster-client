export default function Component() {
  return (
    <section className="flex h-screen w-full flex-col items-center space-y-8 px-4 text-center">
      <svg
        className=" mt-20 h-24 w-24 text-green-500 dark:text-green-300"
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
      <h2 className="text-4xl font-semibold text-gray-300 dark:text-white">
        Your email is verified!
      </h2>
      <p className="text-xl text-gray-400 dark:text-gray-300">
        Your email verification was successful.
      </p>
      {/* <Button variant="slim">
          <Link className="" href="/">
            Return to Homepage
          </Link>
        </Button> */}
    </section>
  );
}
