import React from 'react';
import { IScraperStatusData } from '@/pages/tools/scraper-report';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ok':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-rose-600';
    default:
      return 'bg-zinc-700';
  }
};

type Props = {
  data: IScraperStatusData;
};

const ScraperStatus = ({ data }: Props) => {
  console.log(data);
  return (
    <div className="w-full rounded bg-zinc-800  p-5 md:p-8">
      <h3 className="text-xl font-semibold">Scraper Status</h3>
      <div className="p-2"></div>
      <div className={`grid grid-cols-9 items-center gap-0.5 p-4 text-sm`}>
        {data.scrapers.map((scraper, index) => (
          <>
            <div className="col-span-2 line-clamp-1 w-full text-right text-xs">
              {scraper.name}
            </div>
            {scraper.data.map((status, index) => (
              <div
                key={index}
                className={`col-span-1 h-4 w-4 md:h-6 md:w-6 ${getStatusColor(
                  status
                )} mx-auto`}
              ></div>
            ))}
          </>
        ))}
        <div className="col-span-2"></div>
        {data.timePoints.map((timePoint, index) => (
          <div key={index} className="text-center text-xs">
            {timePoint}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScraperStatus;
