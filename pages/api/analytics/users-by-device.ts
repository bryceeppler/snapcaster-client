import { NextApiRequest, NextApiResponse } from 'next';
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
    const client = new GA4Client();
    const data = await client.getUsersByDevice(days);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in users-by-device API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 