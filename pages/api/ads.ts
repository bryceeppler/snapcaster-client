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

const appendUtmParams = (url: string): string => {
  const utmParams = 'utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement'.trim();
  
  // Check if UTM parameters already exist
  if (url.includes(utmParams)) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      if (process.env.ENV == 'development') {
        const data = await import('@/development/ads.json'); // Adjust the path as necessary
        // shuffle the ads for positions 1, 2, 3
        data.default.position[1].ads.sort(() => Math.random() - 0.5);
        data.default.position[2].ads.sort(() => Math.random() - 0.5);
        data.default.position[3].ads.sort(() => Math.random() - 0.5);
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
            formattedResult.position[ad.ad_slot_id] = { ads: [] };
          }
          formattedResult.position[ad.ad_slot_id].ads.push(ad);
        });

        // Ensure each store has exactly 2 ads per slot
        Object.keys(formattedResult.position).forEach((slot) => {
          const ads = formattedResult.position[parseInt(slot)].ads;
          const adsByStore: { [store_id: number]: Ad[] } = {};

          // Group ads by store_id
          ads.forEach((ad: Ad) => {
            if (!adsByStore[ad.store_id]) {
              adsByStore[ad.store_id] = [];
            }
            adsByStore[ad.store_id].push(ad);
          });

          const adjustedAds: Ad[] = [];

          // Ensure each store has exactly 2 ads
          Object.keys(adsByStore).forEach((storeId) => {
            const storeAds = adsByStore[parseInt(storeId)];

            if (storeAds.length >= 2) {
              // Randomly pick 2 ads if there are more than 2
              adjustedAds.push(...storeAds.slice(0, 2));
            } else if (storeAds.length === 1) {
              // Duplicate the ad if there's only 1
              adjustedAds.push(storeAds[0], storeAds[0]);
            }
          });

          // Shuffle the adjusted ads before assigning back to the position
          formattedResult.position[parseInt(slot)].ads = adjustedAds.sort(
            () => Math.random() - 0.5
          );
        });

        // Add UTM parameters to each ad URL
        Object.values(formattedResult.position).forEach(position => {
          position.ads.forEach(ad => {
            ad.url = appendUtmParams(ad.url);
          });
        });

        res.status(200).json(formattedResult); // Return the formatted result
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
