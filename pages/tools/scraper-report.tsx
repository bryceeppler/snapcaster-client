import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import PageTitle from '@/components/ui/page-title';
import MainLayout from '@/components/MainLayout';
import ScraperMonitor from '@/components/scraper-monitor';
import DataQuality from '@/components/data-quality';
import ScraperStatus from '@/components/scraper-status';
import DocumentCount from '@/components/document-count';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface Report {
  database: string;
  analysis_time: string;
  total_documents: number;
  unique_document_combinations: number;
  total_duplicates: number;
  uniqueness_ratio: number;
  field_completeness: {
    [key: string]: number;
  };
}

const ScraperReport = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_URL}/report`)
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <MainLayout>
      <div className="container flex flex-col gap-4">
        <PageTitle title="Scraper Report" />
        <ScraperMonitor />
        <DataQuality reports={reports} />
        <ScraperStatus />
        <DocumentCount />
      </div>
    </MainLayout>
  );
};

export default ScraperReport;
