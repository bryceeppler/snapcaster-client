import React from 'react';
import { useRef } from 'react';
import axiosInstance from '@/utils/axiosWrapper';

import Head from 'next/head';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SubscriptionCards } from './profile';

import AdvancedCatalog from '@/components/AdvancedCatalog';
import AdvancedSearchCombo from '@/components/AdvancedSearchCombo';
import AdvancedCheckBox from '@/components/AdvancedCheckBox';

import useAuthStore from '@/stores/authStore';
import { advancedUseStore, useOutsideClick } from '@/stores/advancedStore';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

import Link from 'next/link';
type Props = {};

export default function AdvancedSearch({}: Props) {
  const {
    advancedSearchLoading,
    advancedSearchResults,

    selectedCardCategory,

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

    artTypeList,
    selectedhArtTypeList,
    selectedArtTypeCount,

    otherList,
    selectedOtherCount,
    selectedOtherList,

    preReleaseChecked,
    promoChecked,
    alternateArtChecked,
    retroChecked,
    artSeriesChecked,
    goldenStampedChecked,
    numberChecked,

    sortByList,
    selectedSortBy,

    updateSortByFilter,
    updateAdvnacedSearchTextBoxValue,
    changeCardCategory,
    resetFilters,
    toggleRegularCheckboxes,
    updateNumberText,
    toggle,
    fetchAdvancedSearchResults
  } = advancedUseStore();
  const [showFilters, setShowFilters] = React.useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasActiveSubscription = useAuthStore(
    (state) => state.hasActiveSubscription
  );
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
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter">
                  Advanced Search Beta
                </h2>
              </div>
              <div className="outlined-container grid gap-4 p-8 md:gap-4">
                <p className="text-left">
                  You must be logged in to use this feature.
                </p>
                <Link href="/signin">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter">
                  Advanced Search Beta
                </h2>
              </div>
              <div className="outlined-container grid gap-4 p-8 md:gap-4">
                <p className="text-left">
                  You must have an active subscription to use this feature.
                </p>
              </div>
              <SubscriptionCards
                createCheckoutSession={createCheckoutSession}
              />{' '}
            </div>
          </section>
        </div>
      </MainLayout>
    );
  }
  return (
    <>
      <AdvancedSearchHead />
      <div className="mb-16 min-h-screen w-full flex-col items-center justify-between px-4 py-2 md:px-6 lg:px-32 ">
        {/*Container 1 */}
        <div className="pb-2 text-center">
          <h2 className="pb-2 text-4xl font-bold tracking-tighter">
            Advanced Search Beta
          </h2>
          <p className="text-xs text-pink-600">
            Notice: We appreciate your patience as we continue to add missing
            websites from Single Search and Multi Search and fine tune our API.
          </p>
        </div>

        {/*Container 2 */}
        <div className="flex items-center gap-2">
          <Input
            ref={searchRef}
            type="text"
            placeholder="Card Base Name"
            defaultValue={''}
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                if (searchRef.current) {
                  updateAdvnacedSearchTextBoxValue(searchRef.current.value);
                }
                if (numberRef.current) {
                  updateNumberText(Number(numberRef.current.value));
                }
                fetchAdvancedSearchResults();
              }
            }}
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
        {/*Container 2.5 */}
        {showFilters == true && (
          <div className="mb-4">
            <Tabs value={selectedCardCategory}>
              <TabsList className="grid w-full grid-cols-3  p-0 pb-2">
                <TabsTrigger
                  value="allCards"
                  className={
                    'mx-1 rounded border-b-[3px] py-0.5 hover:bg-zinc-800' +
                    (selectedCardCategory == 'allCards'
                      ? ' border-b-pink-600'
                      : '')
                  }
                  onClick={() => {
                    changeCardCategory('allCards');
                  }}
                >
                  All Cards
                </TabsTrigger>
                <TabsTrigger
                  value="nonShowcase"
                  className={
                    'mx-1 rounded border-b-[3px] py-0.5 hover:bg-zinc-800' +
                    (selectedCardCategory == 'nonShowcase'
                      ? ' border-b-pink-600'
                      : '')
                  }
                  onClick={() => {
                    changeCardCategory('nonShowcase');
                  }}
                >
                  Non-Showcase
                </TabsTrigger>
                <TabsTrigger
                  value="showcase"
                  className={
                    'mx-1 rounded border-b-[3px] py-0.5 hover:bg-zinc-800' +
                    (selectedCardCategory == 'showcase'
                      ? ' border-b-pink-600'
                      : '')
                  }
                  onClick={() => {
                    changeCardCategory('showcase');
                  }}
                >
                  Showcase
                </TabsTrigger>
              </TabsList>
              <TabsContent value="allCards">
                <Card className="border-none">
                  <div className=" pl-0.4  relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  ">
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
                      option={artTypeList}
                      selectedList={selectedhArtTypeList}
                      selectCount={selectedArtTypeCount}
                      toggle={toggle}
                      label="Art Type"
                    ></AdvancedSearchCombo>
                    <AdvancedSearchCombo
                      option={otherList}
                      selectedList={selectedOtherList}
                      selectCount={selectedOtherCount}
                      toggle={toggle}
                      label="Other"
                    ></AdvancedSearchCombo>
                    <div className="flex flex-col justify-end">
                      <div className="mb-2 flex items-end">
                        <input
                          id="numberCheckBox"
                          checked={numberChecked}
                          type="checkbox"
                          onClick={() => {
                            toggleRegularCheckboxes('numberCheckBox');
                          }}
                          onChange={(e) => {}}
                          className={
                            'm-auto mx-1 aspect-square h-[11px] w-[11px] cursor-pointer appearance-none rounded-full ' +
                            (numberChecked == true
                              ? ' bg-pink-600'
                              : 'bg-zinc-600')
                          }
                        />
                        <label
                          htmlFor="numberCheckBox"
                          className="w-full cursor-pointer pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Number
                        </label>
                      </div>
                      <Input
                        min="0"
                        type="number"
                        id="cardNumInput"
                        name="cardNumInput"
                        placeholder="Card Number"
                        ref={numberRef}
                        onChange={(e) => {}}
                        disabled={!numberChecked}
                        className="h-7"
                      ></Input>
                    </div>
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
                      title="Retro"
                      value="retroCheckBox"
                      checkedState={retroChecked}
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
                </Card>
              </TabsContent>
              <TabsContent value="nonShowcase">
                <div className=" pl-0.4  relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  ">
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
                    option={artTypeList}
                    selectedList={selectedhArtTypeList}
                    selectCount={selectedArtTypeCount}
                    toggle={toggle}
                    label="Art Type"
                  ></AdvancedSearchCombo>
                  <AdvancedSearchCombo
                    option={otherList}
                    selectedList={selectedOtherList}
                    selectCount={selectedOtherCount}
                    toggle={toggle}
                    label="Other"
                  ></AdvancedSearchCombo>
                  <div className="flex flex-col justify-end">
                    <div className="mb-2 flex cursor-pointer items-end rounded hover:bg-zinc-800">
                      <input
                        id="numberCheckBox"
                        checked={numberChecked}
                        type="checkbox"
                        onClick={() => {
                          toggleRegularCheckboxes('numberCheckBox');
                        }}
                        onChange={(e) => {}}
                        className={
                          'm-auto mx-1 aspect-square h-[11px] w-[11px] cursor-pointer appearance-none rounded-full ' +
                          (numberChecked == true
                            ? ' bg-pink-600'
                            : 'bg-zinc-600')
                        }
                      />
                      <label
                        htmlFor="numberCheckBox"
                        className="w-full cursor-pointer pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Number
                      </label>
                    </div>
                    <Input
                      min="0"
                      type="number"
                      id="cardNumInput"
                      name="cardNumInput"
                      placeholder="Card Number"
                      ref={numberRef}
                      onChange={(e) => {}}
                      className="h-7"
                      disabled={!numberChecked}
                    ></Input>
                  </div>
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
                    title="Retro"
                    value="retroCheckBox"
                    checkedState={retroChecked}
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
              </TabsContent>
              <TabsContent value="showcase">
                <div className=" pl-0.4  relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  ">
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/*Container 3 */}
        <div className=" flex flex-col gap-2 sm:flex-row sm:justify-end">
          <div ref={sortRadioRef} className="relative">
            <Button
              onClick={() => {
                setShoeSoryBy(!showSortBy);
              }}
              className="w-full"
            >
              Sort:{' '}
              {selectedSortBy.charAt(0).toUpperCase() + selectedSortBy.slice(1)}
            </Button>
            <div className="no-scrollbar absolute z-10 max-h-52 w-full overflow-y-auto rounded bg-zinc-900 shadow-2xl sm:w-max">
              {showSortBy &&
                sortByList.map((state) => (
                  <div key={state.abbreviation}>
                    <fieldset>
                      <div
                        className="flex cursor-pointer items-center gap-1 rounded py-1 px-2 hover:bg-zinc-700"
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
          >
            Reset Filters
          </Button>
          <Button
            onClick={() => {
              if (searchRef.current) {
                updateAdvnacedSearchTextBoxValue(searchRef.current.value);
              }
              if (numberRef.current) {
                updateNumberText(Number(numberRef.current.value));
              }

              fetchAdvancedSearchResults();
            }}
            className="min-w-32"
          >
            Search
          </Button>
        </div>

        {/*Container 4 */}
        <div className="justify-centertext-center mx-auto w-full max-w-xl flex-1 flex-col">
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
