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
import { Button } from './button';
import useAuthStore from '@/stores/authStore';
import { AlignJustify } from 'lucide-react';
import { useState } from 'react';
const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Supporters',
    href: '/supporters',
    description: 'A list of our partnered stores who support Snapcaster.'
  },
  // {
  //   title: 'Blog',
  //   href: '/blog',
  //   description:
  //     'Stay up to date with the latest Snapcaster news, updates, and features.'
  // },
  // {
  //   title: 'Guides',
  //   href: '/guides',
  //   description: 'A shopping guide for all the different types of Magic cards.'
  // },
  {
    title: 'Discord',
    href: 'https://discord.gg/EnKKHxSq75',
    description:
      'Join our Discord server to chat with community, report bugs, and suggest features.'
  }
];

export default function Navbar() {
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
          {/* <Link href="/advancedsearch" as="/advancedsearch">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              MTG Advanced Search
            </Button>
          </Link> */}
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
          {/* <Link href="/supporters" as="/supporters">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Supporters
            </Button>
          </Link> */}
          {/* Blog */}
          {/* <Link href="/blog" as="/blog">
            <Button
              variant="ghost"
              className="block w-full text-left text-sm"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Blog
            </Button>
          </Link> */}
          {/* Card Guide */}
          {/* <Link className="" href="/guides" as="/guides">
            <Button variant="ghost" className="block w-full text-left text-sm">
              Card Guide
            </Button>
          </Link> */}
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
      <div className="hidden items-center justify-between p-3 md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link legacyBehavior href="/" passHref>
                <img
                  className="mx-1 h-auto w-5"
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
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-background p-6 no-underline outline-none focus:shadow-md"
                        href="/profile"
                      >
                        <img
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
                          and gain access to exclusive features and discounts.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/multisearch" title="Multi Search">
                    Search up to 100 cards at stores of your choice.
                  </ListItem>
                  {/* <ListItem href="/advancedsearch" title="Advanced Search">
                    Search and filter cards by art type, set, and more.
                  </ListItem> */}
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
            {/* <NavigationMenuItem>
              <Link legacyBehavior href="/about" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
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
