import React, { useEffect } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import Head from 'next/head';
import MainLayout from '@/components/main-page-layout';
import LoadingSpinner from '@/components/loading-spinner';

import AdvancedCatalog from '@/components/advanced-search/advanced-catalog';
import AdvancedCheckBox from '@/components/advanced-search/advanced-checkbox';
import AutoFillSearchBox from '@/components/autofill-searchbox';

import useAuthStore from '@/stores/authStore';
import { advancedUseStore } from '@/stores/advancedStore';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

import LoginRequired from '@/components/login-required';
import SubscriptionRequired from '@/components/subscription-required';
import PageTitle from '@/components/ui/page-title';

import { FilterDropdownBox } from '@/components/advanced-search/advanced-filter-dropdown';
import { useStore } from '@/stores/store';
type Props = {};

export default function AdvancedSearch({}: Props) {
  const autocompleteEndpoint =
    process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL + '/cards?query=';
  const {
    advancedSearchLoading,
    advancedSearchResults,

    selectedWebsiteCount,
    selectedWebsiteList,

    selectedSetCount,
    selectedSetList,

    conditionList,
    selectedConditionsList,
    selectedConditionsCount,

    foilList,
    selectedFoilCount,
    selectedFoilList,

    showcaseTreatmentList,
    selectedShowcaseTreatmentCount,
    selectedShowcaseTreatmentList,

    frameList,
    selectedhFrameList,
    selectedFrameCount,

    preReleaseChecked,
    promoPackChecked,
    promoChecked,
    alternateArtChecked,
    alternateArtJapaneseChecked,
    artSeriesChecked,
    goldenStampedChecked,

    sortByList,
    selectedSortBy,

    setList,
    advancedSearchInput,
    updateSortByFilter,
    setAdvancedSearchInput,
    resetFilters,
    toggle,
    initSetInformation,
    fetchAdvancedSearchResults
  } = advancedUseStore();

  const { initWebsiteInformation, websites } = useStore();

  const [showFilters, setShowFilters] = React.useState(false);

  const { hasActiveSubscription, isAuthenticated } = useAuthStore();
  const [showSortBy, setShoeSoryBy] = React.useState(false);

  const sortRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutsideSort = (event: MouseEvent) => {
    if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
      setShoeSoryBy(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSort);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSort);
    };
  }, []);

  useEffect(() => {
    initWebsiteInformation();
    initSetInformation();
  }, []);

  const createCheckoutSession = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createcheckoutsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      console.log('Checkout session created:', data);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginRequired
        title="Advanced Search"
        message="You must be logged in to use this feature."
      />
    );
  }

  if (!hasActiveSubscription) {
    return (
      <SubscriptionRequired
        title="Advanced Search"
        message="You must have an active subscription to use this feature."
        createCheckoutSession={createCheckoutSession}
      />
    );
  }

  return (
    <>
      <AdvancedSearchHead />
      {/* Base Page layout */}
      <MainLayout>
        {/* Parent Container */}
        <div className="container flex w-full flex-col justify-center text-center ">
          {/*Container 1 - Page Title*/}
          <div className="pb-2 text-center">
            <PageTitle title="Advanced Search" />
            <p className="pb-2 text-xs text-pink-600">
              Notice: We appreciate your patience as we continue to add missing
              websites from Single Search and Multi Search and fine tune our
              API.
            </p>
          </div>

          {/*Container 2 - Search Bar & Show Filters Button*/}
          <div className="flex items-center gap-2">
            <AutoFillSearchBox
              searchFunction={fetchAdvancedSearchResults}
              setSearchInput={setAdvancedSearchInput}
              searchInput={advancedSearchInput}
              autocompleteEndpoint={autocompleteEndpoint}
              tcg={'mtg'}
            ></AutoFillSearchBox>
            <Button
              className="flex justify-between rounded bg-transparent outline outline-1 outline-muted lg:w-48"
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            >
              <p>Show Filters</p>
              <ChevronDown
                className={`h-4 w-4 transform transition-all ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
          <div className="p-2"></div>
          {/*Container 2.5 - Filter Dropdown Options */}
          <div>
            {showFilters == true && (
              <div className="mb-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  <FilterDropdownBox
                    option={websites.map((obj) => {
                      return { name: obj.name, abbreviation: obj.code };
                    })}
                    selectedList={selectedWebsiteList}
                    selectCount={selectedWebsiteCount}
                    toggle={toggle}
                    label="Websites"
                  ></FilterDropdownBox>
                  <FilterDropdownBox
                    option={setList}
                    selectedList={selectedSetList}
                    selectCount={selectedSetCount}
                    toggle={toggle}
                    label="Set"
                  ></FilterDropdownBox>
                  <FilterDropdownBox
                    option={conditionList}
                    selectedList={selectedConditionsList}
                    selectCount={selectedConditionsCount}
                    toggle={toggle}
                    label="Condition"
                  ></FilterDropdownBox>
                  <FilterDropdownBox
                    option={foilList}
                    selectedList={selectedFoilList}
                    selectCount={selectedFoilCount}
                    toggle={toggle}
                    label="Foil"
                  ></FilterDropdownBox>
                  <FilterDropdownBox
                    option={showcaseTreatmentList}
                    selectedList={selectedShowcaseTreatmentList}
                    selectCount={selectedShowcaseTreatmentCount}
                    toggle={toggle}
                    label="Showcase Treatment"
                  ></FilterDropdownBox>
                  <FilterDropdownBox
                    option={frameList}
                    selectedList={selectedhFrameList}
                    selectCount={selectedFrameCount}
                    toggle={toggle}
                    label="Frame"
                  ></FilterDropdownBox>

                  <AdvancedCheckBox
                    title="Promo"
                    value="promoCheckBox"
                    checkedState={promoChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Pre Release"
                    value="preReleaseCheckBox"
                    checkedState={preReleaseChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Promo Pack"
                    value="promoPackCheckBox"
                    checkedState={promoPackChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Alternate Art"
                    value="alternateArtCheckBox"
                    checkedState={alternateArtChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Japanese Alternate Art"
                    value="alternateArtJapaneseCheckBox"
                    checkedState={alternateArtJapaneseChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Art Series"
                    value="artSeriesCheckBox"
                    checkedState={artSeriesChecked}
                  ></AdvancedCheckBox>
                  <AdvancedCheckBox
                    title="Golden Art Series"
                    value="goldenStampedSeriesCheckBox"
                    checkedState={goldenStampedChecked}
                  ></AdvancedCheckBox>
                </div>
              </div>
            )}
          </div>

          {/*Container 3 - Sort, Reset Filters, and Search Buttons*/}
          <div className=" flex flex-col gap-2 sm:flex-row sm:justify-end">
            <div ref={sortRef} className="relative min-w-36">
              <Button
                onClick={() => {
                  setShoeSoryBy(!showSortBy);
                }}
                className="w-full min-w-40 bg-inherit outline outline-1 outline-muted"
              >
                Sort:{' '}
                {selectedSortBy.charAt(0).toUpperCase() +
                  selectedSortBy.slice(1)}
                <ChevronDown
                  className={`ml-auto h-4 w-4 transform transition-all ${
                    showSortBy ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <div
                className={`no-scrollbar 	 absolute z-10 mt-1.5 max-h-52 w-full min-w-36 overflow-y-auto rounded bg-[hsl(var(--background))] shadow-2xl ${
                  showSortBy ? 'outline' : ''
                } outline-1 outline-muted sm:w-max`}
              >
                {showSortBy &&
                  sortByList.map((state) => (
                    <div key={state.abbreviation}>
                      <fieldset>
                        <div
                          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700"
                          onClick={() => {
                            updateSortByFilter(state.abbreviation);
                          }}
                        >
                          <input
                            id={`input-${state.abbreviation}`}
                            type="radio"
                            name="sortRadio"
                            onChange={(e) => {}}
                            className={
                              ' aspect-square h-2 w-2 cursor-pointer appearance-none  rounded-full ' +
                              (selectedSortBy.includes(state.abbreviation)
                                ? ' bg-pink-600 outline-none'
                                : 'bg-zinc-600 outline outline-1 outline-black')
                            }
                          />
                          <label
                            htmlFor={`input-${state.abbreviation}`}
                            className="w-full cursor-pointer px-1 text-sm font-medium"
                          >
                            {state.name}
                          </label>
                        </div>
                      </fieldset>
                    </div>
                  ))}
              </div>
            </div>
            <Button
              onClick={() => {
                resetFilters();
              }}
              className="min-w-40 bg-transparent outline outline-1 outline-muted hover:bg-rose-700"
            >
              Reset Filters
            </Button>
          </div>

          {/*Container 4 */}
          <div className="justify-centertext-center mx-auto w-full flex-1 flex-col">
            {advancedSearchLoading == true && (
              <div className="m-auto block w-min">
                <LoadingSpinner />
              </div>
            )}

            {Object.keys(advancedSearchResults).length > 0 && (
              <div>
                <AdvancedCatalog />
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}

const AdvancedSearchHead = () => {
  return (
    <Head>
      <title>Advanced Search</title>
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
