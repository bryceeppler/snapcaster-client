import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import PoweredBy from '../powered-by';
import useGlobalStore from '@/stores/globalStore';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const { adsEnabled } = useGlobalStore();
  const { isAuthenticated } = useAuth();
  return (
    <footer className="bg-popover py-12 z-30">
      <div className="container grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Pages</h3>
          <nav className="grid gap-2">
            <Link href="/">Home</Link>
            <Link href="/multisearch">Multisearch</Link>
            <Link href="/about">About</Link>
            {!isAuthenticated ? (
              <Link href="/signin">Login</Link>
            ) : (
              <Link href="/profile">Account</Link>
            )}
          </nav>
        </div>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Resources</h3>
          <nav className="grid gap-2">
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Connect</h3>
          <div className="flex gap-4">
            <Link aria-label="Discord" href="https://discord.gg/EnKKHxSq75">
              <DiscordLogoIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="GitHub" href="https://github.com/bryceeppler">
              <GitHubLogoIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        {adsEnabled && (
          <div className="flex items-start justify-end">
            <div className="flex items-center gap-2">
              {/* <PoweredBy size="medium" /> */}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
