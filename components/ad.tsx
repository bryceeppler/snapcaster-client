import Link from 'next/link';
import { handleAdClick } from '@/utils/analytics';

type HorizontalBannerAdProps = {
  positionId: string;
  adType: string;
  adId: string;
  url: string;
  target?: string;
  children: React.ReactNode;
};

export default function BannerAd({
  positionId,
  adType,
  adId,
  url,
  target = '_blank',
  children
}: HorizontalBannerAdProps) {
  return (
    <Link
      data-position-id={positionId}
      data-ad-type={adType}
      data-ad-id={adId}
      className="ad flex items-center justify-center rounded border border-zinc-600 bg-black"
      href={url}
      target={target}
      onClick={() => handleAdClick(positionId, adType, adId, url)}
    >
      {children}
    </Link>
  );
}
