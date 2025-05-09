import { subDays, differenceInDays } from 'date-fns';
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
    const result = await ga4Client.getUniqueUsers(
      start,
      end,
      includePreviousPeriod
    );

    // Calculate average daily users
    const daysDifference = differenceInDays(end, start) + 1; // +1 to include both start and end dates
    const totalDailyUsers = result.data.reduce(
      (sum, day) => sum + day.count,
      0
    );
    const averageDailyUsers = Math.round(totalDailyUsers / daysDifference);

    // Add average daily users to the result
    const enrichedResult = {
      ...result,
      averageDailyUsers
    };

    // Set caching headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );

    return res.status(200).json(enrichedResult);
  } catch (error) {
    console.error('Error fetching unique users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
