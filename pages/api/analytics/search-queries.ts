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
    const { days } = req.query
    const numberOfDays = parseInt(days as string) || 120

    const ga4Client = new GA4Client()
    const data = await ga4Client.getSearchQueriesByDay(numberOfDays)

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching search queries:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 