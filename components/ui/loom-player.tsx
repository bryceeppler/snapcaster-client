import { cn } from '@/lib/utils';

interface LoomPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

export const LoomPlayer = ({ videoId, title, className }: LoomPlayerProps) => {
  return (
    <div
      className={cn(
        'relative aspect-[1.594] w-full overflow-hidden rounded-xl shadow-2xl',
        className
      )}
    >
      <iframe
        src={`https://www.loom.com/embed/${videoId}`}
        title={title || 'Loom video player'}
        className="absolute left-0 top-0 h-full w-full"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};
