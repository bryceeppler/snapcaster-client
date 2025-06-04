'use client';

import { useSearchParams } from 'next/navigation';

function ReturnPage() {
  const searchParams = useSearchParams();
  const connectedAccountId = searchParams?.get('connected_account_id');
  return (
    <div>
      <h2>Details submitted</h2>
      <p>That's everything we need for now</p>
      <p>Connected account ID: {connectedAccountId}</p>
    </div>
  );
}

export default ReturnPage;
