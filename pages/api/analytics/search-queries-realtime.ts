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
    const searchCount = await ga4Client.getSearchQueriesLast30Min()

    return res.status(200).json({ searchCount })
  } catch (error) {
    console.error('Error fetching realtime search queries:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 