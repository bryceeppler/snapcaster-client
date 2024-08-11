
import { Pool } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

interface Ad {
  id: number;
  campaign_id: number;
  name: string;
  store_id: number;
  dimensions: string;
  ad_slot_id: number;
  mobile_image: string;
  desktop_image: string;
  created_at: string;
  position: string;
  url: string;
}

interface FormattedResult {
  position: {
    [key: number]: {
      ads: Ad[];
    };
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === 'GET') {
    try {
      if (process.env.NODE_ENV == 'development' && !process.env.DATABASE_URL) {
        const data = await import('../../development/ads.json'); // Adjust the path as necessary
        res.status(200).json(data.default);
      } else {
        const result = await pool.query(
          `SELECT advertisements.*, ad_slots.position
           FROM advertisements
           JOIN campaigns ON advertisements.campaign_id = campaigns.id
           JOIN ad_slots ON advertisements.ad_slot_id = ad_slots.id
           WHERE campaigns.status = 'ACTIVE'
           AND advertisements.status = 'ACTIVE'`
        );

        // Initialize the result object with the top-level "position" key
        const formattedResult: FormattedResult = { position: {} };

        result.rows.forEach((ad: Ad) => {
          if (!formattedResult.position[ad.ad_slot_id]) {
            formattedResult.position[ad.ad_slot_id] = {
              ads: []
            };
          }
          formattedResult.position[ad.ad_slot_id].ads.push(ad);
        });
        // for ad slot 3, shuffle the ads
        if (formattedResult.position[3]) {
          formattedResult.position[3].ads.sort(() => Math.random() - 0.5);
        }

        res.status(200).json(formattedResult); // Return the formatted result
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}