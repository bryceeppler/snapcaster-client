import { NextApiRequest, NextApiResponse } from 'next'
import { GA4Client } from '@/lib/GA4Client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const ga4Client = new GA4Client()
    const activeUsers = await ga4Client.getActiveUsersLast30Min()

    return res.status(200).json({ activeUsers })
  } catch (error) {
    console.error('Error fetching realtime active users:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 