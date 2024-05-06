type Props = {};

export default function HomeUpdates({}: Props) {
  return (
    <div className="mt-16 space-y-16">
      <div className=" md:flex ">
        <div className="outlined-container mb-4 mr-1  w-full rounded-md bg-transparent sm:w-full md:mb-0 lg:w-1/3 ">
          <div className="">
            <p className="mb-4 mt-2 pl-2 text-left font-serif text-xl font-bold">
              Snapcaster Updates
            </p>
          </div>
          <div className="text-left">
            <p className="ml-2">May 2 2024</p>
            <div className="mx-6 text-muted-foreground ">
              <ul className="text-sm">
                <li>Minor Styling updates.</li>
                <li>Wishlist bug fixes.</li>
                <li>
                  Updated advanced search query options. (Japanese Alt Arts,
                  Raised Foil, etc).
                </li>
                <li>
                  Advanced Searched differentiates promo cards, promo packs, and
                  pre-release cards now.
                </li>
                <li>
                  Online discount codes are automatically applied in query
                  results for single search and advanced search (coming soon to
                  multisearch and wishlists).
                </li>
              </ul>
            </div>
          </div>
          <div className="text-left">
            <p className="ml-2 mt-2">April 14 2024</p>
            <div className="mx-6 text-muted-foreground ">
              <ul className="text-sm">
                <li>
                  Updated the Autofill service to support the new cards in the
                  Outlaws at Thunder Junction set.
                </li>
              </ul>
            </div>
          </div>
          <div className="text-left">
            <p className="ml-2 mt-2">April 1 2024</p>
            <div className="mx-6 text-muted-foreground ">
              <ul className="text-sm">
                <li>New April Development Blog Update.</li>
                <li>
                  Adding back Anime, Manga, and The Moonlit Land Showcase
                  options in advanced search that were accidently removed in a
                  previous update.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="outlined-container flex w-full  flex-col rounded-md bg-transparent sm:w-full md:ml-1">
          <div className="">
            <p className="mb-4 mt-2 pl-2 text-left font-serif text-xl font-bold">
              Development Blogs
            </p>
          </div>

          <div className="hover:scale-104 rounded-md outline-2  outline-slate-400 transition delay-150 duration-300 ease-in-out  hover:bg-[#151518] hover:outline ">
            <div className="flex h-36">
              <div className="flex w-1/2  flex-col  lg:w-3/4 ">
                <div className="lg:flex">
                  <p className=" text-center text-lg font-medium lg:ml-2">
                    May Dev Blog
                  </p>
                  <p className="ml-auto text-center lg:mr-2">Coming Soon</p>
                </div>
                <div className="h-full overflow-hidden">
                  <p className="mr-1 h-full pl-1 text-left  text-muted-foreground lg:ml-2 ">
                    Coming Soon
                  </p>
                </div>
              </div>
              <div className="flex w-1/2 flex-col overflow-hidden rounded-md lg:w-1/4 ">
                <img
                  src="./may-dev.png"
                  className=" h-full w-full object-cover"
                ></img>
              </div>
            </div>
          </div>
          <div className="h-[2px] bg-transparent"></div>
          <a href="/blog/april-dev-update">
            <div className="hover:scale-104 rounded-md outline-2  outline-pink-700 transition delay-150 duration-300 ease-in-out  hover:bg-[#151518] hover:outline ">
              <div className="flex h-36">
                <div className="flex w-1/2  flex-col  lg:w-3/4 ">
                  <div className="lg:flex">
                    <p className=" text-center text-lg font-medium lg:ml-2">
                      April Dev Blog
                    </p>
                    <p className="ml-auto text-center lg:mr-2">April 1 2024</p>
                  </div>
                  <div className="h-full overflow-hidden">
                    <p className="mr-1 h-full pl-1 text-left  text-muted-foreground lg:ml-2 ">
                      We hope with the launch of the new premium features last
                      month that our community have been able to further save on
                      their MTG single purchases. Alongside these new features
                      came a new set of system design considerations,
                      performance improvements, UX changes, and various bug
                      fixes.
                    </p>
                  </div>
                </div>
                <div className="flex w-1/2 flex-col overflow-hidden rounded-md lg:w-1/4 ">
                  <img
                    src="./april-dev.png"
                    className=" h-full w-full object-cover"
                  ></img>
                </div>
              </div>
            </div>
          </a>
          <div className="h-[2px] bg-transparent"></div>
          <a href="/blog/march-dev-update">
            <div className="hover:scale-104 rounded-md outline-2  outline-pink-700 transition delay-150 duration-300 ease-in-out  hover:bg-[#151518] hover:outline ">
              <div className="flex h-36">
                <div className="flex w-1/2  flex-col  lg:w-3/4 ">
                  <div className="lg:flex">
                    <p className=" text-center text-lg font-medium lg:ml-2">
                      March Dev Blog
                    </p>
                    <p className="ml-auto text-center lg:mr-2">March 1 2024</p>
                  </div>
                  <div className="h-full overflow-hidden  text-ellipsis">
                    <p className="mr-1 h-full pl-1 text-left  text-muted-foreground lg:ml-2  ">
                      This month has been a significant one for Snapcaster! I've
                      optimized the backend infrastructure, which has greatly
                      improved both reliability and performance for searches.
                      With these enhancements out of the way, we can now focus
                      on developing new features. Additionally, we've introduced
                      the Snapcaster Pro membership, providing an avenue for
                      users to support the development and maintenance of
                      Snapcaster.
                    </p>
                  </div>
                </div>
                <div className="flex w-1/2 flex-col overflow-hidden rounded-md lg:w-1/4 ">
                  <img src="./march-dev.png" className=" h-full w-full "></img>
                </div>
              </div>
            </div>
          </a>
          <div className="h-[2px] bg-transparent"></div>
          <div className=" mt-auto h-8 text-muted-foreground hover:bg-[#151518] hover:text-slate-200">
            <a href="/blog/">
              <div className="flex h-full">
                <p className="my-auto ml-auto text-sm">More</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right my-auto"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
