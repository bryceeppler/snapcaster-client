import type { NextApiRequest, NextApiResponse } from 'next';

import { GA4Client } from '@/lib/GA4Client';

const VALID_TCGS = [
  'mtg',
  'onepiece',
  'lorcana',
  'yugioh',
  'starwars',
  'fleshandblood',
  'pokemon'
] as const;

type ValidTCG = (typeof VALID_TCGS)[number];

type TCGData = {
  [key in ValidTCG]: Array<{ setName: string; count: number }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date();
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();
    const limit = parseInt(req.query.limit as string) || 10;
    const client = new GA4Client();
    const response = await client.getPopularClickedSets(startDate, endDate);

    // Process the raw GA4 data
    const clickData =
      response.rows
        ?.map((row) => ({
          setName: row.dimensionValues?.[1]?.value || '',
          tcg: row.dimensionValues?.[2]?.value?.toLowerCase() || '',
          count: parseInt(row.metricValues?.[0]?.value || '0', 10)
        }))
        .filter((item) => VALID_TCGS.includes(item.tcg as ValidTCG)) || [];

    // Group by TCG and limit to top N per TCG
    const tcgData = VALID_TCGS.reduce((acc, tcg) => {
      acc[tcg] = [];
      return acc;
    }, {} as TCGData);

    clickData.forEach((item) => {
      // Safely check if the tcg is a valid key
      if (item.tcg && VALID_TCGS.includes(item.tcg as ValidTCG)) {
        const validTcg = item.tcg as ValidTCG;
        if (tcgData[validTcg].length < limit) {
          tcgData[validTcg].push({
            setName: item.setName,
            count: item.count
          });
        }
      }
    });

    // Set caching headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    );

    res.status(200).json(tcgData);
  } catch (error: any) {
    console.error('Error in popular-clicked-cards API:', error);

    // Provide more detailed error information
    const errorDetails = {
      message: 'Internal server error',
      details: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    return res.status(500).json(errorDetails);
  }
}
