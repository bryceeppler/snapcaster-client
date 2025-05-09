import { subDays } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';

import { GA4Client } from '@/lib/GA4Client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { startDate, endDate, numberOfDays, sum } = req.query;

    const ga4Client = new GA4Client();
    let start: Date;
    let end: Date;

    if (numberOfDays) {
      // If numberOfDays is provided, calculate date range from yesterday
      const days = parseInt(numberOfDays as string);
      if (isNaN(days) || days <= 0) {
        return res
          .status(400)
          .json({ message: 'numberOfDays must be a positive number' });
      }
      end = subDays(new Date(), 1); // yesterday
      start = subDays(end, days);
    } else {
      // Otherwise use startDate and endDate
      if (!startDate) {
        return res
          .status(400)
          .json({ message: 'Either startDate or numberOfDays is required' });
      }
      start = new Date(startDate as string);
      end = endDate ? new Date(endDate as string) : new Date();
    }

    const includePreviousPeriod = sum === 'true';

    const result = await ga4Client.getSearchQueriesWithParams(
      start,
      end,
      includePreviousPeriod
    );

    // Set caching headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error fetching search queries with parameters:', error);

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
