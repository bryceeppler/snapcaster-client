'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  AlignJustify,
  ShoppingCart,
  User,
  Settings,
  Palette,
  Plug2,
  CreditCard,
  LayoutDashboard,
  Users,
  Tag,
  Store,
  ShoppingBag,
  BarChart4,
  Tags,
  Shield,
  Home,
  Search,
  Package,
  Info,
  MessageSquare,
  ChevronRight,
  LogOut
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import ModeToggle from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import useBuyListStore from '@/stores/useBuylistStore';
import { Badge } from '@/components/ui/badge';
import { useUserCarts } from '@/hooks/useUserCarts';
import { NavSearchBarFactory } from '@/components/ui/navbar';
import { ResultsToolbarFactory } from '@/components/ui/navbar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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

function MobileNav() {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { isAuthenticated, isVendor, isAdmin, logout } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);
  const { buylistUIState } = useBuyListStore();
  const displaySearchBar =
    currentPath === '/' ||
    currentPath === '/buylists' ||
    currentPath === '/sealed';
  const { openCart: cartSheetOpen, setOpenCart: setCartSheetOpen } =
    useBuyListStore();
  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  // Create accordion states with explicit initial values (never undefined)
  // Use empty string as default value to ensure we're always in controlled mode
  const [accountSection, setAccountSection] = useState<string>(
    pathname?.startsWith('/account') ? 'account' : ''
  );

  const [analyticsSection, setAnalyticsSection] = useState<string>(
    pathname?.startsWith('/vendors') ? 'analytics' : ''
  );

  // Get cart data
  const { getCurrentCart } = useUserCarts();
  const currentCart = getCurrentCart();
  const hasItems =
    currentCart?.cart?.items && currentCart.cart.items.length > 0;
  const cartItemCount = hasItems ? currentCart.cart.items.length : 0;

  // Handle cart button click
  const handleCartClick = () => {
    // Toggle cart sheet
    setCartSheetOpen(!cartSheetOpen);
  };

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Multi Search', href: '/multisearch', icon: Search },
    { label: 'Sealed Search', href: '/sealed', icon: Package },
    { label: 'Buylists', href: '/buylists', icon: ShoppingBag },
    { label: 'About', href: '/about', icon: Info },
    {
      label: 'Discord',
      href: 'https://discord.gg/EnKKHxSq75',
      icon: MessageSquare
    }
  ];

  // Account navigation items (only shown when authenticated)
  const accountNavItems: NavItem[] = [
    { label: 'General', href: '/account', icon: Settings },
    { label: 'Appearance', href: '/account/appearance', icon: Palette },
    { label: 'Integrations', href: '/account/integrations', icon: Plug2 },
    { label: 'Subscription', href: '/account/subscription', icon: CreditCard }
  ];

  // Analytics navigation items (only shown for vendors and admins)
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
        // Only show Approvals menu item for admins
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
    <div className="sticky top-0 z-50 lg:hidden">
      {/* Top Bar: Logo, Hamburger and Cart */}
      <div className="flex justify-between border-b border-border/40 bg-background/95 px-3 py-2.5 shadow-sm backdrop-blur-sm">
        {/* Left: Hamburger Menu */}
        <div className="flex items-center">
          <Sheet
            open={mobileNavSheetOpen}
            onOpenChange={(open) => {
              // When the sheet closes, don't reset accordion states
              // When it opens, keep the current state
              setMobileNavSheetOpen(open);
            }}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 rounded-full hover:bg-accent"
              >
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={'left'}
              className="flex h-full w-[300px] flex-col gap-0 p-0"
            >
              <SheetTitle hidden>Navigation Menu</SheetTitle>
              <SheetDescription hidden>
                Browse the Snapcaster pages
              </SheetDescription>
              <SheetHeader className="border-b p-4">
                <Link href="/" onClick={() => setMobileNavSheetOpen(false)}>
                  <div className="flex cursor-pointer items-center space-x-3">
                    <img
                      className="h-7 w-auto"
                      src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                      alt="Snapcaster"
                    />
                    <p className="font-genos text-2xl font-bold leading-none tracking-tighter">
                      Snapcaster
                    </p>
                  </div>
                </Link>
              </SheetHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation */}
                <div className="px-4 pt-4">
                  <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          currentPath === item.href
                            ? 'border-l-2 border-primary bg-accent/60 pl-[10px] text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground'
                        )}
                        onClick={() => setMobileNavSheetOpen(false)}
                        target={
                          item.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          item.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.label}
                        </div>
                        {item.href.startsWith('http') && (
                          <ChevronRight className="h-4 w-4 opacity-60" />
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Account Section - Only show when authenticated */}
                {isAuthenticated && (
                  <>
                    <Separator className="my-1" />
                    <div className="px-4">
                      <Accordion
                        key="account-accordion"
                        type="single"
                        collapsible
                        value={accountSection || ''}
                        onValueChange={(value) =>
                          setAccountSection(value || '')
                        }
                        className="border-none"
                      >
                        <AccordionItem value="account" className="border-none">
                          <AccordionTrigger className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/40 hover:no-underline data-[state=open]:bg-accent/60">
                            <div className="flex items-center text-sm font-medium">
                              <User className="mr-3 h-4 w-4" />
                              Account
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0 pt-1">
                            <div className="space-y-1 pl-2">
                              {accountNavItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    'flex items-center rounded-md px-4 py-1.5 text-sm transition-colors',
                                    currentPath === item.href
                                      ? 'border-l-2 border-primary bg-accent/40 pl-[14px] font-medium text-accent-foreground'
                                      : 'text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground'
                                  )}
                                  onClick={() => setMobileNavSheetOpen(false)}
                                >
                                  <item.icon className="mr-3 h-4 w-4" />
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </>
                )}

                {/* Analytics Section - Only show for vendors and admins */}
                {canViewAnalytics && (
                  <>
                    <Separator className="my-1" />
                    <div className="px-4">
                      <Accordion
                        key="analytics-accordion"
                        type="single"
                        collapsible
                        value={analyticsSection || ''}
                        onValueChange={(value) =>
                          setAnalyticsSection(value || '')
                        }
                        className="border-none"
                      >
                        <AccordionItem
                          value="analytics"
                          className="border-none"
                        >
                          <AccordionTrigger className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/40 hover:no-underline data-[state=open]:bg-accent/60">
                            <div className="flex items-center text-sm font-medium">
                              <BarChart4 className="mr-3 h-4 w-4" />
                              Analytics
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0 pt-1">
                            <div className="space-y-1 pl-2">
                              {analyticsNavItems.map((group, index) => (
                                <div key={group.title} className="mb-3">
                                  <div className="mb-1 px-4 py-1 text-xs font-medium text-muted-foreground">
                                    {group.title}
                                  </div>
                                  <div className="space-y-1">
                                    {group.items.map((item) => (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                          'flex items-center rounded-md px-4 py-1.5 text-sm transition-colors',
                                          currentPath === item.href
                                            ? 'border-l-2 border-primary bg-accent/40 pl-[14px] font-medium text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground'
                                        )}
                                        onClick={() =>
                                          setMobileNavSheetOpen(false)
                                        }
                                      >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Section: Theme + Sign In/Out */}
              <div className="mt-auto border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="max-w-24">
                    <ModeToggle />
                  </div>
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        logout();
                        setMobileNavSheetOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/signin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => setMobileNavSheetOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Middle: Logo */}
        <div className="absolute left-1/2 top-1/2 flex flex-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <Link href="/" passHref>
            <div className="flex cursor-pointer items-center space-x-2">
              <img
                className="h-5 w-auto"
                src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                alt="Snapcaster"
              />
              <p className="font-genos text-xl font-bold leading-none tracking-tighter">
                Snapcaster
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Cart Icon (for buylists) */}
        <div className="flex items-center">
          {currentPath === '/buylists' &&
            buylistUIState !== 'finalSubmissionState' && (
              <div className="relative">
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                    variant="destructive"
                  >
                    {cartItemCount}
                  </Badge>
                )}
                <Button
                  ref={cartTriggerRef}
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full hover:bg-accent"
                  onClick={handleCartClick}
                  disabled={!currentCart?.cart?.name}
                >
                  <ShoppingCart className="size-[18px]" />
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* Search Bar: Always visible below main nav */}
      {displaySearchBar && (
        <div className="border-b border-border/40 bg-background/80 p-2.5">
          {currentPath === '/' &&
            NavSearchBarFactory('singles', { deviceType: 'mobile' })}
          {currentPath === '/buylists' &&
            NavSearchBarFactory('buylists', { deviceType: 'mobile' })}
          {currentPath === '/sealed' &&
            NavSearchBarFactory('sealed', { deviceType: 'mobile' })}
        </div>
      )}

      {/* Results Toolbar: Filter and pagination */}
      {currentPath === '/' && ResultsToolbarFactory('singles')}
      {currentPath === '/buylists' && ResultsToolbarFactory('buylists')}
    </div>
  );
}

export default MobileNav;
