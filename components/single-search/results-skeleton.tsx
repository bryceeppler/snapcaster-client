export default function ResultsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
    </div>
  );
}
