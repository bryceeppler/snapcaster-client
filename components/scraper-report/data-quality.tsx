import React from 'react';
import { IDataQualityData } from '@/pages/tools/scraper-report';

type Props = {
  reports: IDataQualityData[];
};

const DataQuality = ({ reports }: Props) => {
  return (
    <div className="w-full rounded bg-zinc-800  p-5 md:p-8">
      <h3 className="text-xl font-semibold">Data Quality</h3>
      <div className="p-2"></div>
      <div className="grid w-full gap-0.5 p-4 text-center text-xs md:grid-cols-10 lg:text-sm">
        <div className="col-span-2 mb-1 hidden font-bold md:grid">Source</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Name</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Price</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Set</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Foil</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">
          Condition
        </div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Image</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Link</div>
        <div className="col-span-1 mb-1 hidden font-bold md:grid">Unique</div>

        {reports.map((report, index) => (
          <DataQualityRow key={index} report={report} />
        ))}
      </div>
    </div>
  );
};

const DataQualityRow = ({ report }: { report: IDataQualityData }) => {
  return (
    <>
      <div className="col-span-2 flex items-center justify-center p-4 text-left  md:justify-end md:p-0 md:pr-2 md:text-right">
        {report.database.replace('-inventory', '')}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.name < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.name < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">name</span>
        {report.field_completeness.name.toFixed(2)}
      </div>

      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.price < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.price < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">price</span>
        {report.field_completeness.price.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.set < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.set < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">set</span>
        {report.field_completeness.set.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.foil < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.foil < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">foil</span>
        {report.field_completeness.foil.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.condition < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.condition < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">condition</span>
        {report.field_completeness.condition.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.image < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.image < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">image</span>
        {report.field_completeness.image.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.field_completeness.link < 75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.field_completeness.link < 90
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">link</span>
        {report.field_completeness.link.toFixed(2)}
      </div>
      <div
        className={`col-span-1 flex h-14 flex-col items-center justify-center md:h-10 ${
          report.uniqueness_ratio < 0.75
            ? 'bg-gradient-to-r from-rose-700 to-rose-600'
            : report.uniqueness_ratio < 0.9
            ? 'bg-gradient-to-r from-yellow-700 to-yellow-600'
            : 'bg-gradient-to-r from-green-700 to-green-600'
        } py-0.5 text-xs`}
      >
        <span className="text-white md:hidden">% unique</span>
        {report.uniqueness_ratio.toFixed(2)}
      </div>
    </>
  );
};

export default DataQuality;
