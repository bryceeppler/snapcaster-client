import { cn } from '@/lib/utils';

interface LoomPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

export const LoomPlayer = ({ videoId, title, className }: LoomPlayerProps) => {
  return (
    <div className={cn("relative w-full aspect-[1.594] rounded-xl overflow-hidden shadow-2xl", className)}>
      <iframe
        src={`https://www.loom.com/embed/${videoId}`}
        title={title || "Loom video player"}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};