import { NextApiRequest, NextApiResponse } from 'next'
import { GA4Client, PopularClickedCardsByTCG } from '@/lib/GA4Client'

const VALID_TCGS = ['mtg', 'onepiece', 'lorcana', 'yugioh', 'starwars', 'fleshandblood', 'pokemon'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date()
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date()
    const limit = parseInt(req.query.limit as string) || 10
    const client = new GA4Client()
    const response = await client.getPopularClickedCards(startDate, endDate)

    // Process the raw GA4 data
    const clickData = response.rows?.map((row) => ({
      cardName: row.dimensionValues?.[1].value || '',
      tcg: row.dimensionValues?.[2].value?.toLowerCase() || '',
      count: parseInt(row.metricValues?.[0].value || '0', 10),
    }))
    .filter(item => VALID_TCGS.includes(item.tcg)) || []

    // Group by TCG and limit to top N per TCG
    const tcgData: PopularClickedCardsByTCG = {}

    // Initialize all valid TCGs with empty arrays
    VALID_TCGS.forEach(tcg => {
      tcgData[tcg] = [];
    });

    clickData.forEach((item) => {
      if (tcgData[item.tcg].length < limit) {
        tcgData[item.tcg].push({ cardName: item.cardName, count: item.count })
      }
    })

    // Set caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    res.status(200).json(tcgData)
  } catch (error: any) {
    console.error('Error in popular-clicked-cards API:', error)
    
    // Provide more detailed error information
    const errorDetails = {
      message: 'Internal server error',
      details: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
    
    return res.status(500).json(errorDetails)
  }
} 