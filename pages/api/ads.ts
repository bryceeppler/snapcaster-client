import { Pool } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

// Define the ad and formatted result types
interface Ad {
  id: number;
  campaign_id: number;
  name: string;
  store_id: number;
  dimensions: string;
  ad_slot_id: number;
  mobile_image: string;
  desktop_image: string;
  created_at: string; // Or Date if you parse it
  position: string;
}

interface FormattedResult {
  position: {
    [key: number]: {
      ads: Ad[];
    };
  };
}

// Create a pool instance to connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // Correct the configuration key
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        // select all ads where the campaign status is active
        `SELECT advertisements.*, ad_slots.position
         FROM advertisements
         JOIN campaigns ON advertisements.campaign_id = campaigns.id
         JOIN ad_slots ON advertisements.ad_slot_id = ad_slots.id
         WHERE campaigns.status = 'ACTIVE'`
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

      res.status(200).json(formattedResult); // Return the formatted result
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
