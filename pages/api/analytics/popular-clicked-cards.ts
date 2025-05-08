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
type CardData = { cardName: string; count: number; averagePrice: number };
type TCGData = Record<ValidTCG, CardData[]>;

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
    const response = await client.getPopularClickedCards(startDate, endDate);

    // Process the raw GA4 data
    const clickData =
      response.rows
        ?.map((row) => ({
          cardName: row.dimensionValues?.[1]?.value || '',
          tcg: row.dimensionValues?.[2]?.value?.toLowerCase() || '',
          count: parseInt(row.metricValues?.[0]?.value || '0', 10),
          price:
            row.dimensionValues?.[3]?.value === '(not set)'
              ? null
              : parseFloat(row.dimensionValues?.[3]?.value || '0') / 100
        }))
        .filter((item) => VALID_TCGS.includes(item.tcg as ValidTCG)) || [];

    // Initialize tcgData with all valid TCGs
    const tcgData = VALID_TCGS.reduce((acc, tcg) => {
      acc[tcg] = [];
      return acc;
    }, {} as TCGData);

    // Group data by card name and TCG to calculate averages
    const cardAverages = new Map<
      string,
      {
        totalPrice: number;
        priceCount: number;
        totalCount: number;
        tcg: ValidTCG;
      }
    >();

    clickData.forEach((item) => {
      // Ensure we only process valid TCGs
      if (VALID_TCGS.includes(item.tcg as ValidTCG)) {
        const validTcg = item.tcg as ValidTCG;
        const key = `${validTcg}-${item.cardName}`;
        const existing = cardAverages.get(key);

        if (existing) {
          // Only add to price calculations if we have a valid price
          if (item.price !== null) {
            existing.totalPrice += item.price * item.count;
            existing.priceCount += item.count;
          }
          existing.totalCount += item.count;
        } else {
          cardAverages.set(key, {
            totalPrice: item.price !== null ? item.price * item.count : 0,
            priceCount: item.price !== null ? item.count : 0,
            totalCount: item.count,
            tcg: validTcg
          });
        }
      }
    });

    // Convert to final format with averages
    cardAverages.forEach((data, key) => {
      const keyParts = key.split('-');
      if (keyParts.length !== 2) return;

      const [tcgKey, cardNameKey] = keyParts;
      const cardName = cardNameKey || '';

      // Validate that the tcg exists in our valid list
      if (!VALID_TCGS.includes(tcgKey as ValidTCG)) return;

      const tcg = tcgKey as ValidTCG;

      // Only calculate average if we have valid price data
      const avgPrice =
        data.priceCount > 0 ? data.totalPrice / data.priceCount : 0;

      if (tcgData[tcg].length < limit) {
        tcgData[tcg].push({
          cardName,
          count: data.totalCount,
          averagePrice: Math.round(avgPrice * 100) / 100
        });
      }
    });

    // Sort each TCG's cards by count
    VALID_TCGS.forEach((tcg) => {
      tcgData[tcg].sort((a, b) => b.count - a.count);
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
