import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

import { Button } from './button';
import useAuthStore from '@/stores/authStore';
import { AlignJustify } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import RegionSelector from './region-selector';
import ModeToggle from '../theme-toggle';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* MOBILE NAV */}
      <div className="relative flex h-16 items-center justify-between bg-popover md:hidden">
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
        <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" as="/">
              <img
                className="block h-8 w-auto lg:hidden"
                src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                alt="Snapcaster"
              />
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          mobileMenuOpen ? 'outlined-container m-1 block h-fit p-2' : 'hidden'
        } animate-in md:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
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

          {/* <Link href="/buylists" as="/buylists">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Buy Lists
            </Button>
          </Link> */}

          <Link
            href="https://discord.gg/EnKKHxSq75"
            as="https://discord.gg/EnKKHxSq75"
          >
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Discord
            </Button>
          </Link>

          <Link href="/supporters" as="/supporters">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Supporters
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

          <ModeToggle />

          {/* <div className="flex items-center gap-2 ml-4">
          <RegionSelector />

            <span className="text-sm">Region</span>
          </div> */}
        </div>
      </div>

      {/* DESKTOP NAV SM+ */}
      <div className="hidden items-center justify-between p-3 md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link legacyBehavior href="/" passHref>
                <img
                  className=" mx-5 h-auto w-4 cursor-pointer"
                  src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                  alt="Snapcaster"
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
              <Link legacyBehavior href="/multisearch" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Multi Search
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link legacyBehavior href="/buylists" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Buy Lists
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <Link
                legacyBehavior
                href="https://discord.gg/EnKKHxSq75"
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Discord
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link legacyBehavior href="/supporters" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Supporters
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <ModeToggle />
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
      </div>
    </>
  );
};

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

export default Navbar;
