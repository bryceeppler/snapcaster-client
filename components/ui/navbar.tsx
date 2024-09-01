import * as React from 'react';
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
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hideNav, setHideNav] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY === 0);
      // Show the menu if scrolled
      if (window.scrollY > 0) {
        setHideNav(false);
      }
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (!atTop) {
          setHideNav(true);
        }
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', resetTimer); // Reset timer on mouse move

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', resetTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [atTop]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Reset the timer when the mouse leaves
    timerRef.current = setTimeout(() => {
      if (!atTop) {
        setHideNav(true);
      }
    }, 3000);
  };

  return (
    <>
      {/* MOBILE NAV */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`sticky top-0 z-50 flex h-16 items-center justify-between transition-all duration-500 ${
          atTop ? 'bg-background' : 'bg-popover'
        } ${
          hideNav && !atTop ? 'pointer-events-none opacity-0' : 'opacity-100'
        } md:hidden`}
      >
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${
          mobileMenuOpen
            ? 'outlined-container sticky top-16 z-50 m-1 block h-fit bg-background '
            : 'hidden'
        } ${
          hideNav && !atTop ? 'pointer-events-none opacity-0' : 'opacity-100'
        } ${
          !atTop && 'bg-popover'
        } transition-all duration-500 animate-in md:hidden `}
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
              Sponsors
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
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`sticky top-0 z-50 hidden items-center justify-between p-3 transition-all duration-500 md:flex ${
          atTop ? 'bg-background' : 'bg-popover'
        }
        ${hideNav && !atTop ? 'pointer-events-none opacity-0' : 'opacity-100'}
        `}
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="cursor:pointer">
              <Link legacyBehavior href="/" passHref>
                <img
                  className="mx-1 h-auto w-5 cursor-pointer"
                  src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                  alt="Snapcaster"
                />
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link legacyBehavior href="/" passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()}   transition-all duration-500 ${
                    atTop ? 'bg-background' : 'bg-popover'
                  }`}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link legacyBehavior href="/multisearch" passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()}   transition-all duration-500 ${
                    atTop ? 'bg-background' : 'bg-popover'
                  }`}
                >
                  Multi Search
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                legacyBehavior
                href="https://discord.gg/EnKKHxSq75"
                passHref
              >
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()}   transition-all duration-500 ${
                    atTop ? 'bg-background' : 'bg-popover'
                  }`}
                >
                  Discord
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link legacyBehavior href="/supporters" passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()}   transition-all duration-500 ${
                    atTop ? 'bg-background' : 'bg-popover'
                  }`}
                >
                  Sponsors
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
