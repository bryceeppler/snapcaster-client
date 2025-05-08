import type { NextApiRequest, NextApiResponse } from 'next';

import type { PopularBuyClicksByTCG } from '@/lib/GA4Client';
import { GA4Client } from '@/lib/GA4Client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const days = parseInt(req.query.days as string) || 30;
    const limit = parseInt(req.query.limit as string) || 10;
    const client = new GA4Client();
    const response = await client.getPopularBuyClicks(days);
    // Process the raw GA4 data
    const buyClickData =
      response.rows?.map((row) => ({
        cardName: row.dimensionValues?.[1].value || '',
        tcg: row.dimensionValues?.[2].value || '',
        count: parseInt(row.metricValues?.[0].value || '0', 10)
      })) || [];

    // Group by TCG and limit to top 100 per TCG
    const tcgData: PopularBuyClicksByTCG = {};

    buyClickData.forEach((item) => {
      if (!tcgData[item.tcg]) {
        tcgData[item.tcg] = [];
      }
      if (tcgData[item.tcg].length < limit) {
        tcgData[item.tcg].push({ cardName: item.cardName, count: item.count });
      }
    });

    res.status(200).json(tcgData);
  } catch (error) {
    console.error('Error in popular-searches API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
