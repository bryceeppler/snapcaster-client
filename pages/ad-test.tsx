import React, { useState, useEffect, useMemo } from 'react';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import {
  AdvertisementPosition,
  AdvertisementWithImages
} from '@/types/advertisements';
import { createWeightedSelectionManager } from '@/utils/weightedSelection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useVendors } from '@/hooks/queries/useVendors';
interface DistributionItem {
  vendor_slug: string;
  expected: number;
  actual: number;
  weight: number;
  id: number;
}

const AdTest = () => {
  // State for simulation controls
  const [position, setPosition] = useState<AdvertisementPosition>(
    AdvertisementPosition.FEED
  );
  const [numSelections, setNumSelections] = useState(1000);
  const [simulationResults, setSimulationResults] = useState<
    Record<string, number>
  >({});
  const [hasRun, setHasRun] = useState(false);

  // Get ads for the selected position
  const { getAdsByPosition } = useAdvertisements();
  const ads = useMemo(
    () => getAdsByPosition(position),
    [getAdsByPosition, position]
  );

  const { getVendorNameById } = useVendors();

  // Log ads to debug
  useEffect(() => {
    if (ads.length > 0) {
      console.log('Ads loaded:', ads);
      console.log('Sample ad data structure:', ads[0]);
    }
  }, [ads]);

  // Create ad selection manager for simulation
  const selectionManager = useMemo(() => {
    const manager = createWeightedSelectionManager<AdvertisementWithImages>();
    manager.setItems(ads);
    return manager;
  }, [ads]);

  // Prepare data for visualization
  const distributionData = useMemo(() => {
    if (!hasRun || !ads.length) return [];

    const totalSelections = numSelections;
    const totalWeight = ads.reduce((sum, ad) => sum + ad.weight, 0);

    return ads.map((ad) => {
      // Create a fallback vendor identifier in case vendor_slug is missing
      const vendorId = ad.vendor_id;
      // Use ad.vendor_slug if available, otherwise use a generated identifier
      const vendorName = getVendorNameById(vendorId);

      const weight = ad.weight;
      const expected = parseFloat(((weight / totalWeight) * 100).toFixed(2));
      const actual = parseFloat(
        (
          ((simulationResults[vendorName] || 0) / totalSelections) *
          100
        ).toFixed(2)
      );

      return {
        vendor_name: vendorName,
        expected: expected,
        actual: actual,
        weight: weight,
        id: ad.id
      };
    });
  }, [ads, simulationResults, hasRun, numSelections]);

  // Run the simulation
  const runSimulation = () => {
    if (!ads.length) return;

    const results: Record<string, number> = {};

    // Initialize results for all vendors
    ads.forEach((ad) => {
      // Use ad.vendor_slug if available, otherwise use a generated identifier
      const vendorId = ad.vendor_id;
      const vendorName = getVendorNameById(vendorId);
      results[vendorName] = 0;
    });

    // Run the simulation n times
    for (let i = 0; i < numSelections; i++) {
      const selectedIndex = selectionManager.selectRandom();
      if (selectedIndex >= 0) {
        const selectedAd = ads[selectedIndex];
        const vendorId = selectedAd.vendor_id;
        const vendorName = getVendorNameById(vendorId);
        results[vendorName] = (results[vendorName] || 0) + 1;
      }
    }

    console.log('Simulation results:', results);
    setSimulationResults(results);
    setHasRun(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Ad Distribution Testing</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Ad Position</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={position}
              onValueChange={(val) => setPosition(val as AdvertisementPosition)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ad Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AdvertisementPosition.TOP_BANNER}>
                  Top Banner
                </SelectItem>
                <SelectItem value={AdvertisementPosition.LEFT_BANNER}>
                  Left Banner
                </SelectItem>
                <SelectItem value={AdvertisementPosition.RIGHT_BANNER}>
                  Right Banner
                </SelectItem>
                <SelectItem value={AdvertisementPosition.FEED}>Feed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Number of Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min="100"
              max="100000"
              value={numSelections}
              onChange={(e) =>
                setNumSelections(parseInt(e.target.value) || 1000)
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ads Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runSimulation}
              disabled={!ads.length}
              className="w-full"
            >
              Run Simulation
            </Button>
          </CardContent>
        </Card>
      </div>

      {hasRun && (
        <>
          <h2 className="mb-4 text-2xl font-bold">Simulation Results</h2>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Expected vs Actual Distribution (%)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="vendor_name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name, props) => [`${value}%`, name]}
                      labelFormatter={(value) => `Vendor: ${value}`}
                    />
                    <Legend />
                    <Bar dataKey="expected" name="Expected %" fill="#8884d8" />
                    <Bar dataKey="actual" name="Actual %" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <h2 className="mb-4 text-2xl font-bold">Detailed Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Vendor</th>
                  <th className="border p-2 text-left">Weight</th>
                  <th className="border p-2 text-left">Expected %</th>
                  <th className="border p-2 text-left">Actual Count</th>
                  <th className="border p-2 text-left">Actual %</th>
                  <th className="border p-2 text-left">Difference</th>
                </tr>
              </thead>
              <tbody>
                {distributionData.map((item, index) => {
                  const difference = item.actual - item.expected;
                  return (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2 font-medium">
                        {item.vendor_name || `Vendor ${item.id}`}
                      </td>
                      <td className="border p-2">{item.weight}</td>
                      <td className="border p-2">{item.expected}%</td>
                      <td className="border p-2">
                        {simulationResults[item.vendor_name] || 0}
                      </td>
                      <td className="border p-2">{item.actual}%</td>
                      <td
                        className={`border p-2 ${
                          difference > 0
                            ? 'text-green-600'
                            : difference < 0
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {difference > 0 ? '+' : ''}
                        {difference.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdTest;
