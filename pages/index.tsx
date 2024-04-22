import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/Homebanner';
import SingleSearchbox from '@/components/SingleSearchbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import SingleSearchInfo from '@/components/SingleSearchInfo';
import SearchFilters from '@/components/SingleSearchFilters';
import { useStore } from '@/stores/store';
import SingleCatalog from '@/components/SingleCatalog';
import MainLayout from '@/components/MainLayout';
import SingleSearchFilter from '@/components/single-search-filters';
import AutoFillSearchBox from '@/components/AutoFillSearchBox';
type Props = {};

const Home: NextPage<Props> = () => {
  const {
    singleSearchResults,
    singleSearchResultsLoading,
    singleSearchStarted,
    singleSearchInput,
    setSingleSearchInput,
    fetchSingleSearchResults
  } = useStore();

  return (
    <>
      <HomeHead />
      <MainLayout>
        <div className="container flex w-full flex-col justify-center text-center">
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <div />
                <Homebanner />
              </div>
            )}
          <div className="mt-6">
            <AutoFillSearchBox
              searchFunction={fetchSingleSearchResults}
              setSearchInput={setSingleSearchInput}
              searchInput={singleSearchInput}
            />
          </div>

          {!singleSearchStarted && !singleSearchResultsLoading && (
            <div className="mt-8 space-y-16">
              <div className=" sm:flex ">
                <div className="outlined-container mb-4 mr-1 rounded-md bg-[#0f0f11] sm:mb-0 sm:w-1/3  ">
                  <div className="">
                    <p className="mb-4 mt-2 pl-2 text-left font-serif text-xl font-bold">
                      Snapcaster Updates
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="ml-2">April 22 2024</p>
                    <div className="mx-6 text-muted-foreground ">
                      <ul className="text-sm">
                        <li>Minor Styling updates.</li>
                        <li>Wishlist bug fixes.</li>
                        <li>
                          Updated advanced search query options. (Japanese Alt
                          Arts, Raised Foil, etc)
                        </li>
                        <li>
                          Online discount codes are automatically applied in
                          query results for single search and advanced search
                          (coming soon to multisearch and wishlists).
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="ml-2 mt-2">April 14 2024</p>
                    <div className="mx-6 text-muted-foreground ">
                      <ul className="text-sm">
                        <li>
                          Updated the Autofill service to support the new cards
                          in the Outlaws at Thunder Junction set.
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
                          Adding back Anime, Manga, and The Moonlit Land
                          Showcase options in advanced search that were
                          accidently removed in a previous update.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="outlined-container ml-1 flex flex-col  rounded-md bg-[#0f0f11] sm:w-2/3">
                  <div className="">
                    <p className="mb-4 mt-2 pl-2 text-left font-serif text-xl font-bold">
                      Development Blogs
                    </p>
                  </div>
                  <div className="h-[2px] bg-black"></div>
                  <div className="hover:bg-[#151518]">
                    <div className="flex h-36">
                      <div className="flex w-1/4 flex-col ">
                        <img
                          src="./may-dev.png"
                          className="mx-auto my-auto  max-h-24 rounded-md"
                        ></img>
                      </div>
                      <div className="flex w-3/4 flex-col ">
                        <div className="flex">
                          <p className="ml-2 text-lg font-medium">
                            May Dev Blog
                          </p>
                          <p className="ml-auto mr-2 ">May 1 2024</p>
                        </div>
                        <div className="h-full overflow-hidden">
                          <p className="ml-2  h-full  text-left text-muted-foreground">
                            Coming Soon...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[2px] bg-black"></div>
                  <a href="https://www.snapcaster.ca/blog/april-dev-update">
                    <div>
                      <div className="flex h-36 hover:bg-[#151518]">
                        <div className="flex w-1/4 flex-col ">
                          <img
                            src="./april-dev.png"
                            className="mx-auto my-auto  max-h-24 rounded-md"
                          ></img>
                        </div>
                        <div className="flex w-3/4 flex-col ">
                          <div className="flex">
                            <p className="ml-2 text-lg font-medium">
                              April Dev Blog
                            </p>
                            <p className="ml-auto mr-2 ">April 1 2024</p>
                          </div>
                          <div className="h-full overflow-hidden">
                            <p className="ml-2 h-full text-left  text-sm text-muted-foreground">
                              We hope with the launch of the new premium
                              features last month that our community have been
                              able to further save on their MTG single
                              purchases. Alongside these new features came a new
                              set of system design considerations, performance
                              improvements, UX changes, and various bug fixes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>

                  <div className="h-[2px] bg-black"></div>
                  <a href="https://www.snapcaster.ca/blog/march-dev-update">
                    <div>
                      <div className="flex h-36 hover:bg-[#151518]">
                        <div className="flex w-1/4 flex-col ">
                          <img
                            src="./march-dev.png"
                            className="mx-auto my-auto  max-h-24 rounded-md"
                          ></img>
                        </div>
                        <div className="flex w-3/4 flex-col ">
                          <div className="flex">
                            <p className="ml-2 text-lg font-medium">
                              March Dev Blog
                            </p>
                            <p className="ml-auto mr-2 ">March 1 2024</p>
                          </div>
                          <div className="h-full overflow-hidden">
                            <p className="ml-2 h-full text-left  text-sm text-muted-foreground">
                              This month has been a significant one for
                              Snapcaster! I've optimized the backend
                              infrastructure, which has greatly improved both
                              reliability and performance for searches. With
                              these enhancements out of the way, we can now
                              focus on developing new features. Additionally,
                              we've introduced the Snapcaster Pro membership,
                              providing an avenue for users to support the
                              development and maintenance of Snapcaster.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[2px] bg-black"></div>
                  </a>
                  <div className=" mt-auto h-8 text-muted-foreground hover:bg-[#151518] hover:text-slate-200">
                    <a href="https://www.snapcaster.ca/blog/">
                      <div className="flex h-full">
                        <p className="my-auto ml-auto text-sm">More</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
          )}
          {singleSearchResultsLoading && (
            <div className="flex items-center justify-center pt-5">
              <LoadingSpinner />
            </div>
          )}
          {Object.keys(singleSearchResults).length > 0 && (
            <>
              <SingleSearchInfo />
              <SingleSearchFilter />
              <SingleCatalog />
            </>
          )}
          {singleSearchStarted &&
            !singleSearchResultsLoading &&
            Object.keys(singleSearchResults).length === 0 && (
              <div className="flex items-center justify-center pt-5">
                <p className="text-zinc-500">No results found</p>
              </div>
            )}
        </div>
      </MainLayout>
    </>
  );
};

export default Home;

const HomeHead = () => {
  return (
    <Head>
      <title>Snapcaster</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
