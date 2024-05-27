import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon
} from '@radix-ui/react-icons';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-popover py-12">
      <div className="container grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Pages</h3>
          <nav className="grid gap-2">
            <Link href="#">Home</Link>
            <Link href="/multisearch">Multisearch</Link>
            <Link href="/supporters">Supporters</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Resources</h3>
          <nav className="grid gap-2">
            {/* <Link href="/contact">Contact</Link> */}
            <Link href="/guides">Guides</Link>
            {/* <Link href="/faq">FAQ</Link> */}
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
            <Link
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/bryceeppler/"
            >
              <LinkedInLogoIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="GitHub" href="https://github.com/bryceeppler">
              <GitHubLogoIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="flex items-start justify-end">
          <div className="flex items-center gap-2">
            <img
              src="/obsidian_icon.png"
              alt="Obsidian Games Logo"
              className="h-8 w-auto"
            />
            <span className="text-md text-zinc-300">
              Powered by Obsidian Games
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
