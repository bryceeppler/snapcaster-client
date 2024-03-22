import React from 'react';
import { IDataQualityData } from '@/pages/tools/scraper-report';

type Props = {
  reports: IDataQualityData[];
};
const getColorFromPercentage = (value: number) => {
  let red = 255,
    green = 0;

  if (value < 50) {
    green = Math.floor((value / 50) * 255);
  } else {
    green = 255;
    red = Math.floor(((100 - value) / 50) * 255);
  }
  let opacity = 0.5;

  return `rgba(${red}, ${green}, 0, ${opacity})`;
};
const DataQuality = ({ reports }: Props) => {
  return (
    <div className="w-full rounded bg-zinc-800 p-4">
      <h3>Data Quality</h3>
      <div className="p-2"></div>
      <div className="grid w-full gap-0.5 p-4 text-center text-xs md:grid-cols-10 lg:text-sm">
        <div className="col-span-2 hidden font-bold md:grid">Source</div>
        <div className="col-span-1 hidden font-bold md:grid">Name</div>
        <div className="col-span-1 hidden font-bold md:grid">Price</div>
        <div className="col-span-1 hidden font-bold md:grid">Set</div>
        <div className="col-span-1 hidden font-bold md:grid">Foil</div>
        <div className="col-span-1 hidden font-bold md:grid">Condition</div>
        <div className="col-span-1 hidden font-bold md:grid">Image</div>
        <div className="col-span-1 hidden font-bold md:grid">Link</div>
        <div className="col-span-1 hidden font-bold md:grid">Unique</div>

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
      <div className="col-span-2 text-left text-xs">
        {report.database.replace('-inventory', '')}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.name
          )
        }}
      >
        {report.field_completeness.name}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.price
          )
        }}
      >
        {report.field_completeness.price.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(report.field_completeness.set)
        }}
      >
        {report.field_completeness.set.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.foil
          )
        }}
      >
        {report.field_completeness.foil.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.condition
          )
        }}
      >
        {report.field_completeness.condition.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.image
          )
        }}
      >
        {report.field_completeness.image.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(
            report.field_completeness.link
          )
        }}
      >
        {report.field_completeness.link.toFixed(2)}
      </div>
      <div
        className="col-span-1 py-0.5 text-xs"
        style={{
          backgroundColor: getColorFromPercentage(report.uniqueness_ratio * 100)
        }}
      >
        {report.uniqueness_ratio.toFixed(2)}
      </div>
    </>
  );
};

export default DataQuality;
