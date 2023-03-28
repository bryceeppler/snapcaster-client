// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

console.log('Hello from Functions!');

serve(async (req: { json: () => Promise<{ cardNames: string[] }> }) => {
  const { cardNames } = await req.json();

  const request = {
    cardNames: cardNames,
    websites: ['all'],
    worstCondition: 'DMG'
  };

  const response = await fetch(
    'https://snapcasterv2-api-production.up.railway.app/search/bulk/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  );

  const body = await response.json();
  console.log('response body: ', body);

  // Now we have something like this:
  // [
  //   {
  //       "cardName": "austere command",
  //       "variants": [
  //           {
  //               "name": "Austere Command",
  //               "link": "https://www.everythinggames.ca/products/austere-command-extended-art-commander-legends",
  //               "image": "https://images.binderpos.com/0460e139-11c5-5dd2-a37e-c2868e9f1b71.jpg",
  //               "set": "Commander Legends",
  //               "condition": "NM",
  //               "foil": false,
  //               "price": 6,
  //               "website": "everythinggames"
  //           },
  //           {
  //               "name": "Austere Command",
  //               "link": "https://www.everythinggames.ca/products/austere-command-iconic-masters",
  //               "image": "https://images.binderpos.com/a7ae00b2-92bb-5259-aa02-892760819f0c.jpg",
  //               "set": "Iconic Masters",
  //               "condition": "NM",

  // Using this information, connect to the database and update the lowest price for each card in the watchlist with it's lowest cost variant

    // call the database function with the body 
    // return the body

    
  
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
