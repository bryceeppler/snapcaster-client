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

export interface IScraperTaskData {
  name: string;
  timestamps: Array<{
    time: string;
    status: 'complete' | 'error' | 'in_progress';
  }>;
}

export interface IDocumentCountData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

export interface IScraperStatusData {
  scrapers: Array<{
    name: string;
    data: Array<'complete' | 'error' | 'in_progress'>;
  }>;
  timePoints: string[];
}

export interface IDataQualityData {
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

export interface IReportResponse {
  data_quality: IDataQualityData;
  scraper_status: IScraperStatusData;
  document_count: IDocumentCountData;
  scraper_task: IScraperTaskData;
}

const ScraperReport = () => {
  const [dataQuality, setDataQuality] = useState<IDataQualityData[]>([]);
  const [scraperStatus, setScraperStatus] = useState<IScraperStatusData>({
    scrapers: [],
    timePoints: []
  });
  const [documentCounts, setDocumentCounts] = useState<IDocumentCountData>({
    labels: [],
    datasets: []
  });
  const [scraperTasks, setScraperTasks] = useState<IScraperTaskData[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_URL}/report`)
      .then((response) => response.json())
      .then((data) => {
        setDataQuality(data.data_quality);
        setScraperStatus(data.scraper_status);
        setDocumentCounts(data.document_count);
        setScraperTasks(data.scraper_tasks);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <MainLayout>
      <div className="container flex flex-col gap-4">
        <PageTitle title="Scraper Report" />
        <ScraperMonitor tasks={scraperTasks} />
        <DataQuality reports={dataQuality} />
        <ScraperStatus data={scraperStatus} />
        <DocumentCount data={documentCounts} />
      </div>
    </MainLayout>
  );
};

export default ScraperReport;
