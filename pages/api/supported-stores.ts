
import { Pool } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

interface Vendor {
  id: number;
  slug: string;
  name: string;
  url: string;
 }

const pool = new Pool({
  connectionString: process.env.PRIMARY_DATABASE_URL
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      if (process.env.ENV == 'development') {
        const result = await pool.query(
            `SELECT id, slug, name, url, region
             FROM vendors
             WHERE region = 'ca';`
          );
  
        res.status(200).json(result.rows as Vendor[]);
      } else {
        const result = await pool.query(
          `SELECT id, slug, name, url, region
           FROM vendors
           WHERE region = 'ca';`
        );

        res.status(200).json(result.rows as Vendor[]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
