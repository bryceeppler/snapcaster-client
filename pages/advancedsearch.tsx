import React from 'react';
import { useRef } from 'react';
import axiosInstance from '@/utils/axiosWrapper';

import Head from 'next/head';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

import AdvancedCatalog from '@/components/AdvancedCatalog';
import AdvancedSearchCombo from '@/components/AdvancedSearchCombo';
import AdvancedCheckBox from '@/components/AdvancedCheckBox';

import useAuthStore from '@/stores/authStore';
import { advancedUseStore, useOutsideClick } from '@/stores/advancedStore';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import LoginRequired from '@/components/login-required';
import SubscriptionRequired from '@/components/subscription-required';
import PageTitle from '@/components/ui/page-title';
type Props = {};

export default function AdvancedSearch({}: Props) {
  const {
    advancedSearchLoading,
    advancedSearchResults,

    websiteList,
    selectedWebsiteCount,
    selectedWebsiteList,

    setList,
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
    promoChecked,
    alternateArtChecked,
    artSeriesChecked,
    goldenStampedChecked,

    sortByList,
    selectedSortBy,

    updateSortByFilter,
    updateAdvnacedSearchTextBoxValue,
    resetFilters,
    toggle,
    fetchAdvancedSearchResults
  } = advancedUseStore();

  const [showFilters, setShowFilters] = React.useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { hasActiveSubscription, isAuthenticated } = useAuthStore();
  const [showSortBy, setShoeSoryBy] = React.useState(false);
  const sortRadioRef = useOutsideClick(() => {
    setShoeSoryBy(false);
  });

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
        <div className="container flex w-full flex-col justify-center text-center">
          {/*Container 1 - Page Title*/}
          <div className="pb-2 text-center">
            <PageTitle title="Advanced Search" />
            <p className="text-xs text-pink-600">
              Notice: We appreciate your patience as we continue to add missing
              websites from Single Search and Multi Search and fine tune our
              API.
            </p>
          </div>

          {/*Container 2 - Search Bar & Show Filters Button*/}
          <div className="flex items-center gap-2">
            <Input
              ref={searchRef}
              type="text"
              placeholder="Card Base Name"
              defaultValue={''}
            ></Input>

            <Button
              className="flex justify-between rounded lg:w-48"
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            >
              <p>Show Filters</p>
              <CaretSortIcon className=" h-6 w-6" />
            </Button>
          </div>
          <div className="p-2"></div>
          {/*Container 2.5 - Filter Dropdown Options */}
          {showFilters == true && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                <AdvancedSearchCombo
                  option={websiteList}
                  selectedList={selectedWebsiteList}
                  selectCount={selectedWebsiteCount}
                  toggle={toggle}
                  label="Websites"
                ></AdvancedSearchCombo>
                <AdvancedSearchCombo
                  option={setList}
                  selectedList={selectedSetList}
                  selectCount={selectedSetCount}
                  toggle={toggle}
                  label="Set"
                ></AdvancedSearchCombo>
                <AdvancedSearchCombo
                  option={conditionList}
                  selectedList={selectedConditionsList}
                  selectCount={selectedConditionsCount}
                  toggle={toggle}
                  label="Condition"
                ></AdvancedSearchCombo>
                <AdvancedSearchCombo
                  option={foilList}
                  selectedList={selectedFoilList}
                  selectCount={selectedFoilCount}
                  toggle={toggle}
                  label="Foil"
                ></AdvancedSearchCombo>
                <AdvancedSearchCombo
                  option={showcaseTreatmentList}
                  selectedList={selectedShowcaseTreatmentList}
                  selectCount={selectedShowcaseTreatmentCount}
                  toggle={toggle}
                  label="Showcase Treatment"
                ></AdvancedSearchCombo>
                <AdvancedSearchCombo
                  option={frameList}
                  selectedList={selectedhFrameList}
                  selectCount={selectedFrameCount}
                  toggle={toggle}
                  label="Art Type"
                ></AdvancedSearchCombo>
                <AdvancedCheckBox
                  title="Pre Release"
                  value="preReleaseCheckBox"
                  checkedState={preReleaseChecked}
                ></AdvancedCheckBox>
                <AdvancedCheckBox
                  title="Promo"
                  value="promoCheckBox"
                  checkedState={promoChecked}
                ></AdvancedCheckBox>
                <AdvancedCheckBox
                  title="Alternate Art"
                  value="alternateArtCheckBox"
                  checkedState={alternateArtChecked}
                ></AdvancedCheckBox>
                <AdvancedCheckBox
                  title="Art Series"
                  value="artSeriesCheckBox"
                  checkedState={artSeriesChecked}
                ></AdvancedCheckBox>
                <AdvancedCheckBox
                  title="Golden Stamped"
                  value="goldenStampedSeriesCheckBox"
                  checkedState={goldenStampedChecked}
                ></AdvancedCheckBox>
              </div>
            </div>
          )}

          {/*Container 3 - Sort, Reset Filters, and Search Buttons*/}
          <div className=" flex flex-col gap-2 sm:flex-row sm:justify-end">
            <div ref={sortRadioRef} className="relative">
              <Button
                onClick={() => {
                  setShoeSoryBy(!showSortBy);
                }}
                className="w-full min-w-32"
              >
                Sort:{' '}
                {selectedSortBy.charAt(0).toUpperCase() +
                  selectedSortBy.slice(1)}
              </Button>
              <div className="no-scrollbar absolute z-10 max-h-52 w-full overflow-y-auto rounded bg-zinc-900 shadow-2xl sm:w-max">
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
                              ' aspect-square h-2 w-2 cursor-pointer appearance-none rounded-full ' +
                              (selectedSortBy.includes(state.abbreviation)
                                ? ' bg-pink-600'
                                : 'bg-zinc-600')
                            }
                          />
                          <label
                            htmlFor={`input-${state.abbreviation}`}
                            className="w-full cursor-pointer px-1 text-sm"
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
              className="min-w-32"
            >
              Reset Filters
            </Button>
            <Button
              onClick={() => {
                if (searchRef.current) {
                  updateAdvnacedSearchTextBoxValue(searchRef.current.value);
                }

                fetchAdvancedSearchResults();
              }}
              className="min-w-32"
            >
              Search
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
                <AdvancedCatalog></AdvancedCatalog>
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
