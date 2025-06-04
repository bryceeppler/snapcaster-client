export default async function OrderSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const sessionId = (await searchParams).session_id;

  if (!sessionId) {
    return <div>No session ID</div>;
  }

  return <div>OrderSuccessPage {sessionId}</div>;
}
