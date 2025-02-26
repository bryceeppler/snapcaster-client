import { NextApiRequest, NextApiResponse } from 'next';
import { GA4Client } from '@/lib/GA4Client';
import { subDays } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { numberOfDays } = req.query;
    const days = numberOfDays ? parseInt(numberOfDays as string) : 30;
    let startDate: Date;
    let endDate: Date;
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: 'numberOfDays must be a positive number' });
    }

    endDate = subDays(new Date(), 1);
    startDate = subDays(endDate, days);

    const ga4Client = new GA4Client();
    const response = await ga4Client.getVendorBuyClicks(startDate, endDate);
    
    // Set caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching vendor buy clicks:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor buy clicks data' });
  }
} 