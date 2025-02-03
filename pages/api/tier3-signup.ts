import { NextApiRequest, NextApiResponse } from 'next';

interface Tier3SignupData {
  subscriptionType: 'monthly' | 'quarterly';
  email: string;
  name: string;
  storeName: string;
  notes?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body as Tier3SignupData;
    const toAddresses = ["eppler97@gmail.com", "info@snapcaster.gg"];
    const fromAddress = "info@snapcaster.gg";
    const subject = "New Tier 3 Signup";
    const replyTo = "info@snapcaster.gg";
    const textBody = `Name: ${data.name}\nEmail: ${data.email}\nStore Name: ${data.storeName}\nNotes: ${data.notes}\nSubscription Type: ${data.subscriptionType}`;
    const htmlBody = `<p>Name: ${data.name}</p>
    <p>Email: ${data.email}</p>
    <p>Store Name: ${data.storeName}</p>
    <p>Notes: ${data.notes}</p>
    <p>Subscription Type: ${data.subscriptionType}</p>`;

    const response = await fetch(`${process.env.EMAIL_URL}/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toAddresses, fromAddress, subject, htmlBody, textBody, replyTo }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error processing signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 