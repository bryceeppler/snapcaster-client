import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
        // get the mail api url from the environment variables
        const mailApiUrl = process.env.EMAIL_SERVICE_URL;
        const mailApiKey = process.env.EMAIL_SERVICE_KEY;

        if (!mailApiKey) {
            throw new Error('EMAIL_SERVICE_KEY is not defined');
        }

        // send the request to the mail api
        const response = await fetch(`${mailApiUrl}/api/v1/send`, {
            method: 'POST',
            headers: {
                'api-key': mailApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    toAddresses: ["eppler97@gmail.com"],
                    fromAddress: "info@snapcaster.gg",
                    subject: `Snapcaster Application - ${req.body.ownerName}`,
                    htmlBody: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>New Snapcaster Store Application</h2>
                            <hr>
                            <h3>Store Information</h3>
                            <p><strong>Owner Name:</strong> ${req.body.ownerName}</p>
                            <p><strong>Store Name:</strong> ${req.body.storeName}</p>
                            <p><strong>Store URL:</strong> <a href="${req.body.storeUrl}">${req.body.storeUrl}</a></p>
                            <p><strong>Email:</strong> ${req.body.email}</p>
                            <p><strong>Address:</strong> ${req.body.address}</p>
                            
                            <h3>Technical Details</h3>
                            <p><strong>Inventory System:</strong> ${req.body.inventorySystem}${req.body.otherInventorySystem ? ` (${req.body.otherInventorySystem})` : ''}</p>
                            <p><strong>Trading Card Games:</strong> ${req.body.tcgs.join(', ')}</p>
                            
                            <h3>Additional Questions/Comments</h3>
                            <p>${req.body.questions}</p>
                        </div>
                    `,
                    textBody: `
New Snapcaster Store Application

Store Information:
Owner Name: ${req.body.ownerName}
Store Name: ${req.body.storeName}
Store URL: ${req.body.storeUrl}
Email: ${req.body.email}
Address: ${req.body.address}

Technical Details:
Inventory System: ${req.body.inventorySystem}${req.body.otherInventorySystem ? ` (${req.body.otherInventorySystem})` : ''}
Trading Card Games: ${req.body.tcgs.join(', ')}

Additional Questions/Comments:
${req.body.questions}
                    `.trim(),
                    replyTo: req.body.email // Changed to use applicant's email as reply-to
            })
        });
        res.status(response.status).json(response.body);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
