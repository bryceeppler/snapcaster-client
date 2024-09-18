// components/single-search/results-skeleton.tsx
import React from 'react';

export default function ResultsSkeleton() {
  return (
    <div className="grid min-h-svh gap-6 md:grid-cols-[240px_1fr]">
      {/* Sidebar Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <div className="relative flex w-full gap-2">
            <div className="child-1 w-1/2 md:w-full">
              {/* Skeleton for FilterDropdown */}
              <div className="h-10 w-full animate-pulse rounded bg-accent"></div>
            </div>
            <div className="child-2 w-1/2 md:hidden">
              {/* Skeleton for SingleSortBy */}
              <div className="h-10 w-full animate-pulse rounded bg-accent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid h-min gap-6">
        <div className="flex justify-between">
          {/* Skeleton for Heading */}
          <div className="h-8 w-40 animate-pulse rounded bg-accent"></div>
          <div className="hidden md:block">
            {/* Skeleton for SingleSortBy */}
            <div className="h-10 w-40 animate-pulse rounded bg-accent"></div>
          </div>
        </div>

        {/* Skeleton for Results Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-96 w-full animate-pulse rounded-lg bg-accent"
            ></div>
          ))}
        </div>
      </div>

      {/* Optionally include the BackToTopButton if needed */}
      {/* <BackToTopButton /> */}
    </div>
  );
}
