import { NextApiRequest, NextApiResponse } from 'next';
import { GA4Client } from '@/lib/GA4Client';
import { subDays, parseISO } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { numberOfDays, startDate, endDate, limit } = req.query;
    let start: Date;
    let end: Date;
    
    // Handle date range or numberOfDays
    if (startDate && endDate) {
      // Use date range
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      if (start > end) {
        return res.status(400).json({ message: 'startDate must be before endDate' });
      }
    } else {
      // Use numberOfDays
      const days = numberOfDays ? parseInt(numberOfDays as string) : 30;
      
      if (isNaN(days) || days <= 0) {
        return res.status(400).json({ message: 'numberOfDays must be a positive number' });
      }
      
      end = subDays(new Date(), 1);
      start = subDays(end, days);
    }
    
    // Parse limit parameter
    const vendorLimit = limit ? parseInt(limit as string) : 5;
    
    const ga4Client = new GA4Client();
    const response = await ga4Client.getVendorBuyClicks(start, end, vendorLimit);
    
    // Set caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching vendor buy clicks:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor buy clicks data' });
  }
} 