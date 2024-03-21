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
import { Bar, Pie } from 'react-chartjs-2';
import PageTitle from '@/components/ui/page-title';
import MainLayout from '@/components/MainLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Report {
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

interface CompletenessChartProps {
  data: Report;
}

const CompletenessChart: React.FC<CompletenessChartProps> = ({ data }) => {
  const completenessLabels = Object.keys(data.field_completeness);
  const completenessValues = Object.values(data.field_completeness);
  const missingValues = completenessValues.map((value) => 100 - value);

  const chartData = {
    labels: completenessLabels,
    datasets: [
      {
        label: 'Field Completeness (%)',
        data: completenessValues,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        stack: 'stack0'
      },
      {
        label: 'Missing (%)',
        data: missingValues,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        stack: 'stack0' // Same stack as completeness data
      }
    ]
  };

  const options = {
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

const UniquenessChart: React.FC<CompletenessChartProps> = ({ data }) => {
  const uniquenessLabels = ['Unique Document Combinations', 'Total Duplicates'];
  const uniquenessValues = [
    data.unique_document_combinations,
    data.total_duplicates
  ];
  const chartData = {
    labels: uniquenessLabels,
    datasets: [
      {
        data: uniquenessValues,
        backgroundColor: ['#166534', '#991b1b']
      }
    ]
  };

  return <Pie data={chartData} />;
};

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
      <PageTitle title="Scraper Report" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <div key={index} className="outlined-container col-span-1 p-4">
            <h2 className="text-xl font-bold">{report.database}</h2>
            <p className="text-sm">
              Analysis Time: {new Date(report.analysis_time).toLocaleString()}
            </p>
            <div className="p-2"></div>
            <h3 className="text-lg font-bold">Field Completeness</h3>
            <CompletenessChart data={report} />
            <div className="p-2"></div>

            <h3 className="text-lg font-bold">Document Uniqueness</h3>
            <UniquenessChart data={report} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default ScraperReport;
