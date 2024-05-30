import Link from 'next/link';
import { handleAdClick } from '@/utils/analytics';

type HorizontalBannerAdProps = {
  positionId: string;
  adType: string;
  adId: string;
  href: string;
  target?: string;
  children: React.ReactNode;
};

export default function HorizontalBannerAd({
  positionId,
  adType,
  adId,
  href,
  target = '_blank',
  children
}: HorizontalBannerAdProps) {
  return (
    <Link
      data-position-id={positionId}
      data-ad-type={adType}
      data-ad-id={adId}
      className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
      href={href}
      target={target}
      onClick={() => handleAdClick(positionId, adType, adId, href)}
    >
      {children}
    </Link>
  );
}
