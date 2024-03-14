import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import { Button } from './ui/button';
import useAuthStore from '@/stores/authStore';
import { AlignJustify } from 'lucide-react';
import { useState } from 'react';
import favicon from 'public/favicon.ico';
const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Blog',
    href: '/updates',
    description:
      'Stay up to date with the latest Snapcaster news, updates, and features.'
  },
  {
    title: 'Discord',
    href: 'https://discord.gg/EnKKHxSq75',
    description:
      'Join our Discord server to chat with community, report bugs, and suggest features.'
  }
];

export default function NavbarNew() {
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* MOBILE NAV */}
      <div className="relative flex h-16 items-center justify-between bg-muted sm:hidden">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            className="m-2 inline-flex items-center justify-center p-2"
          >
            <AlignJustify
              className="h-6 w-6"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" as="/">
              <Image
                className="block h-8 w-auto lg:hidden"
                src={favicon}
                alt="Snapcaster"
              />
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          mobileMenuOpen ? 'outlined-container m-1 block h-fit p-2' : 'hidden'
        } animate-in sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          <Link href="/" as="/">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
          </Link>

          {/* Multi Search */}
          <Link href="/multisearch" as="/multisearch">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Multi Search
            </Button>
          </Link>
          {/* Advanced Search */}
          <Link href="/advancedsearch" as="/advancedsearch">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Advanced Search
            </Button>
          </Link>
          {/* Wishlists */}
          <Link href="/wishlist" as="/wishlist">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Wishlists
            </Button>
          </Link>
          {/* Blog */}
          <Link href="/updates" as="/updates">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Blog
            </Button>
          </Link>
          {/* Discord */}
          <Link className="" href="https://discord.gg/EnKKHxSq75">
            <Button variant="ghost" className="block w-full text-left text-sm">
              Discord
            </Button>
          </Link>

          {!isAuthenticated && (
            <Link href="/signin">
              <Button
                variant="ghost"
                className="block w-full text-left text-sm"
              >
                Login
              </Button>
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/profile">
              <Button
                variant="ghost"
                className="block w-full text-left text-sm"
              >
                Account
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* DESKTOP NAV SM+ */}
      <div className="hidden items-center justify-between p-3 sm:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link legacyBehavior href="/" passHref>
                <Image
                  className="mx-1"
                  src="/favicon.ico"
                  alt="Snapcaster"
                  width={35}
                  height={35}
                />
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link legacyBehavior href="/" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Snapcaster Pro</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Image
                          src="/favicon.ico"
                          width={35}
                          height={35}
                          alt="Snapcaster Pro"
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Snapcaster Pro
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Support Snapcaster by purchasing a Pro subscription
                          and gain access to premium and experimental features.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/multisearch" title="Multi Search">
                    Search up to 100 cards at stores of your choice.
                  </ListItem>
                  <ListItem href="/advancedsearch" title="Advanced Search">
                    Search and filter cards by art type, set, and more.
                  </ListItem>
                  <ListItem href="/wishlist" title="Wishlists">
                    Easily check prices for all cards in your wishlist and
                    receive email notifications when a good deal is found.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Community</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link legacyBehavior href="/about" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {!isAuthenticated && (
          <Link href="/signin">
            <Button className="px-4 py-2 text-sm font-medium">Login</Button>
          </Link>
        )}
        {isAuthenticated && (
          <Link href="/profile">
            <Button className="px-4 py-2 text-sm font-medium">Account</Button>
          </Link>
        )}
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild ref={ref}>
        <Link
          href={props.href as string}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
