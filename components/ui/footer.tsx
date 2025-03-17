import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  InstagramLogoIcon
} from '@radix-ui/react-icons';
import Link from 'next/link';
import useGlobalStore from '@/stores/globalStore';
import { useAuth } from '@/hooks/useAuth';
import { FacebookIcon } from 'lucide-react';

export default function Footer() {
  const { adsEnabled } = useGlobalStore();
  const { isAuthenticated } = useAuth();
  return (
    <footer className="z-30 bg-popover py-6">
      <div className="container grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="grid content-start gap-2">
          <h3 className="text-lg font-semibold">Pages</h3>
          <nav className="grid gap-2">
            <Link href="/">Home</Link>
            <Link href="/multisearch">Multi Search</Link>
            <Link href="/sealed">Sealed Search</Link>
            <Link href="/buylists">Buylists</Link>
            {!isAuthenticated ? (
              <Link href="/signin">Login</Link>
            ) : (
              <Link href="/profile">Account</Link>
            )}
          </nav>
        </div>
        <div className="grid content-start gap-2">
          <h3 className="text-lg font-semibold">Resources</h3>
          <nav className="grid gap-2">
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="grid content-start gap-2">
          <h3 className="text-lg font-semibold">Connect</h3>
          <div className="flex gap-4">
            <Link aria-label="Discord" href="https://discord.gg/EnKKHxSq75">
              <DiscordLogoIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="GitHub" href="https://github.com/bryceeppler">
              <GitHubLogoIcon className="h-6 w-6" />
            </Link>
            <Link
              aria-label="Instagram"
              href="https://www.instagram.com/snapcasterca/"
            >
              <InstagramLogoIcon className="h-6 w-6" />
            </Link>
            <Link
              aria-label="Facebook"
              href="https://www.facebook.com/profile.php?id=61570086781596"
            >
              <FacebookIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
