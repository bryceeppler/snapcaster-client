import Link from 'next/link';
import { handleAdClick } from '@/utils/analytics';

type VerticalBannerAdProps = {
  positionId: string;
  adType: string;
  adId: string;
  url: string;
  side?: 'left' | 'right';
  target?: string;
  children: React.ReactNode;
};

export default function VerticalBannerAd({
  positionId,
  adType,
  adId,
  url,
  side,
  target = '_blank',
  children
}: VerticalBannerAdProps) {
  return (
    <Link
      data-position-id={positionId}
      data-ad-type={adType}
      data-ad-id={adId}
      className={`ad fixed max-h-[480px] ${
        side === 'left' ? 'left-10' : 'right-10'
      } top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col`}
      href={url}
      target={target}
      onClick={() => handleAdClick(positionId, adType, adId, url)}
    >
      {children}
    </Link>
  );
}
