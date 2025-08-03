'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AlignJustify,
  BarChart4,
  CreditCard,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Palette,
  Plug2,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  Tags,
  User,
  Users
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import { MobileNavLink } from './nav-link';
import {
  ResultsToolbar,
  SearchBar,
  getSearchModeForPath
} from './search-provider';

import ModeToggle from '@/components/theme-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useUserCarts } from '@/hooks/useUserCarts';
import useBuylistStore from '@/stores/useBuylistStore';

// Interface for navigation items with icons
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

// Interface for navigation groups
interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Mobile navigation bar component
 * Shown on small to medium screens (< lg)
 */
export default function MobileNavbar(): JSX.Element {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { isAuthenticated, isVendor, isAdmin, logout } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);
  const { buylistUIState } = useBuylistStore();
  const { openCart: cartSheetOpen, setOpenCart: setCartSheetOpen } =
    useBuylistStore();
  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  // Initialize accordion states based on current path
  const [accountSection, setAccountSection] = useState<string>(
    pathname?.startsWith('/account') ? 'account' : ''
  );
  const [analyticsSection, setAnalyticsSection] = useState<string>(
    pathname?.startsWith('/vendors') ? 'analytics' : ''
  );

  // Get cart data - only fetch when on buylists page
  const isOnBuylistsPage = currentPath.startsWith('/buylists');
  const { getCurrentCart } = useUserCarts();
  const currentCart = isOnBuylistsPage ? getCurrentCart() : null;
  const cartItemCount = currentCart?.cart?.items?.length || 0;
  const hasCartItems = cartItemCount > 0;
  const isCartVisible =
    isOnBuylistsPage && buylistUIState !== 'finalSubmissionState';
  const isCartEnabled = Boolean(currentCart?.cart?.name);

  // Handle cart button click
  const handleCartClick = () => setCartSheetOpen(!cartSheetOpen);

  // Close mobile navigation
  const closeMobileNav = () => setMobileNavSheetOpen(false);

  // Sign out handler
  const handleSignOut = () => {
    logout();
    closeMobileNav();
  };

  // Navigation data
  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    {
      label: 'Multi Search',
      href: `/multisearch/`,
      icon: Search
    },
    {
      label: 'Sealed Search',
      href: `/sealed/`,
      icon: Package
    },
    {
      label: 'Buylists',
      href: `/buylists/`,
      icon: ShoppingBag
    },
    { label: 'About', href: '/about', icon: Info },
    {
      label: 'Discord',
      href: 'https://discord.gg/EnKKHxSq75',
      icon: MessageSquare
    }
  ];

  const accountNavItems: NavItem[] = [
    { label: 'General', href: '/account', icon: Settings },
    { label: 'Appearance', href: '/account/appearance', icon: Palette },
    { label: 'Integrations', href: '/account/integrations', icon: Plug2 },
    { label: 'Subscription', href: '/account/subscription', icon: CreditCard }
  ];

  const analyticsNavItems: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/vendors/dashboard',
          icon: LayoutDashboard
        },
        { label: 'Users', href: '/vendors/dashboard/users', icon: Users },
        { label: 'TCGs', href: '/vendors/dashboard/tcgs', icon: Tag },
        { label: 'Vendors', href: '/vendors/dashboard/vendors', icon: Store },
        {
          label: 'Buylists',
          href: '/vendors/dashboard/buylists',
          icon: ShoppingBag
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Advertisements',
          href: '/vendors/dashboard/settings/advertisements',
          icon: Tags
        },
        {
          label: 'Discounts',
          href: '/vendors/dashboard/settings/discounts',
          icon: Tag
        },
        ...(isAdmin
          ? [
              {
                label: 'Approvals',
                href: '/vendors/dashboard/settings/approvals',
                icon: Shield
              }
            ]
          : [])
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background md:hidden">
      <nav
        className="relative flex justify-between px-3 py-2.5"
        aria-label="Mobile navigation"
      >
        {/* Hamburger Menu Button */}
        <Sheet open={mobileNavSheetOpen} onOpenChange={setMobileNavSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 rounded-full hover:bg-accent"
              aria-label="Open menu"
            >
              <AlignJustify className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex h-full w-[300px] flex-col gap-0 p-0"
            aria-label="Site navigation"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Browse the Snapcaster pages
            </SheetDescription>

            <SheetHeader className="border-b p-4">
              <Link
                href="/"
                onClick={closeMobileNav}
                className="flex items-center space-x-3"
              >
                <img
                  className="h-7 w-auto"
                  src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                  alt="Snapcaster"
                  width="28"
                  height="28"
                />
                <span className="font-genos text-2xl font-bold leading-none tracking-tighter">
                  Snapcaster
                </span>
              </Link>
            </SheetHeader>

            {/* Main Navigation Menu */}
            <div className="flex-1 overflow-y-auto">
              <section className="px-4 pt-4" aria-label="Main navigation">
                <ul className="space-y-1">
                  {mainNavItems.map((item) => (
                    <li key={item.href}>
                      <MobileNavLink
                        href={item.href}
                        isActive={currentPath === item.href}
                        onClick={closeMobileNav}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className="mr-3 h-4 w-4"
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </div>
                      </MobileNavLink>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Account Section */}
              {isAuthenticated && (
                <NavAccordionSection
                  title="Account"
                  icon={User}
                  items={accountNavItems}
                  currentPath={currentPath}
                  sectionValue={accountSection}
                  onSectionValueChange={setAccountSection}
                  closeMobileNav={closeMobileNav}
                />
              )}

              {/* Analytics Section */}
              {canViewAnalytics && (
                <AnalyticsAccordionSection
                  groups={analyticsNavItems}
                  currentPath={currentPath}
                  sectionValue={analyticsSection}
                  onSectionValueChange={setAnalyticsSection}
                  closeMobileNav={closeMobileNav}
                />
              )}
            </div>

            {/* Footer: Theme Toggle + Auth Button */}
            <footer className="mt-auto border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <ModeToggle />
                </div>

                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Link href="/signin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={closeMobileNav}
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                )}
              </div>
            </footer>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Snapcaster home"
          >
            <img
              className="h-5 w-auto"
              src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
              alt="Snapcaster"
              aria-hidden="true"
              width="20"
              height="20"
            />
            <span className="font-genos text-xl font-bold leading-none tracking-tighter">
              Snapcaster
            </span>
          </Link>
        </div>

        {/* Cart Button */}
        {isCartVisible && (
          <div className="relative right-0 top-0">
            <Button
              ref={cartTriggerRef}
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full hover:bg-accent"
              onClick={handleCartClick}
              disabled={!isCartEnabled}
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="size-[18px]" aria-hidden="true" />
              {hasCartItems && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                  variant="default"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        )}
      </nav>

      {/* Search Bar */}
      {getSearchModeForPath(currentPath) && (
        <section
          className="px-2 pb-2"
          aria-label={`Search ${getSearchModeForPath(currentPath)}`}
        >
          <SearchBar currentPath={currentPath} deviceType="mobile" />
        </section>
      )}

      {/* Results Toolbar */}
      <ResultsToolbar currentPath={currentPath} />
    </header>
  );
}

// Navigation menu accordion section
const NavAccordionSection = ({
  title,
  icon: Icon,
  items,
  currentPath,
  sectionValue,
  onSectionValueChange,
  closeMobileNav
}: {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
  currentPath: string;
  sectionValue: string;
  onSectionValueChange: (value: string) => void;
  closeMobileNav: () => void;
}) => {
  return (
    <section aria-label={`${title} navigation`}>
      <Separator className="my-1" />
      <div className="px-4">
        <Accordion
          type="single"
          collapsible
          value={sectionValue}
          onValueChange={onSectionValueChange}
          className="border-none"
        >
          <AccordionItem value={title.toLowerCase()} className="border-none">
            <AccordionTrigger
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/40 hover:no-underline data-[state=open]:bg-accent/60"
              aria-label={`Toggle ${title.toLowerCase()} menu`}
            >
              <div className="flex items-center text-sm font-medium">
                <Icon className="mr-3 h-4 w-4" aria-hidden="true" />
                <span>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 pt-1">
              <ul className="space-y-1 pl-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <MobileNavLink
                      href={item.href}
                      isActive={currentPath === item.href}
                      onClick={closeMobileNav}
                      className="px-4 py-1.5"
                    >
                      <div className="flex items-center">
                        <item.icon
                          className="mr-3 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </div>
                    </MobileNavLink>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

// Analytics accordion with grouped items
const AnalyticsAccordionSection = ({
  groups,
  currentPath,
  sectionValue,
  onSectionValueChange,
  closeMobileNav
}: {
  groups: NavGroup[];
  currentPath: string;
  sectionValue: string;
  onSectionValueChange: (value: string) => void;
  closeMobileNav: () => void;
}) => {
  return (
    <section aria-label="Analytics navigation">
      <Separator className="my-1" />
      <div className="px-4">
        <Accordion
          type="single"
          collapsible
          value={sectionValue}
          onValueChange={onSectionValueChange}
          className="border-none"
        >
          <AccordionItem value="analytics" className="border-none">
            <AccordionTrigger
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/40 hover:no-underline data-[state=open]:bg-accent/60"
              aria-label="Toggle analytics menu"
            >
              <div className="flex items-center text-sm font-medium">
                <BarChart4 className="mr-3 h-4 w-4" aria-hidden="true" />
                <span>Analytics</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 pt-1">
              <div className="space-y-1 pl-2">
                {groups.map((group) => (
                  <div key={group.title} className="mb-3">
                    <h3 className="mb-1 px-4 py-1 text-xs font-medium text-muted-foreground">
                      {group.title}
                    </h3>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <MobileNavLink
                            href={item.href}
                            isActive={currentPath === item.href}
                            onClick={closeMobileNav}
                            className="px-4 py-1.5"
                          >
                            <div className="flex items-center">
                              <item.icon
                                className="mr-3 h-4 w-4"
                                aria-hidden="true"
                              />
                              <span>{item.label}</span>
                            </div>
                          </MobileNavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
