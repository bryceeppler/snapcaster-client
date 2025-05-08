import type { NextApiRequest, NextApiResponse } from 'next'

import { GA4Client } from '@/lib/GA4Client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { startDate, endDate } = req.query
    
    if (!startDate) {
      return res.status(400).json({ message: 'startDate is required' })
    }

    const ga4Client = new GA4Client()
    const data = await ga4Client.getActiveUsers(
      new Date(startDate as string),
      endDate ? new Date(endDate as string) : undefined
    )

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching active users:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 