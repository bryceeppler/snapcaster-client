'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CreditCard,
  LogOut,
  Palette,
  Settings,
  Store,
  User,
  Webhook
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types/navigation';

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();
  const menuItems: MenuItem[] = [
    {
      title: 'General',
      icon: User,
      href: '/account',
      isActive: pathname === '/account'
    },
    {
      title: 'Marketplace',
      icon: Store,
      href: '/account/marketplace',
      isActive: pathname?.startsWith('/account/marketplace') || false
    },
    {
      title: 'Appearance',
      icon: Palette,
      href: '/account/appearance',
      isActive: pathname === '/account/appearance'
    },
    {
      title: 'Integrations',
      icon: Webhook,
      href: '/account/integrations',
      isActive: pathname === '/account/integrations'
    },
    {
      title: 'Subscription',
      icon: CreditCard,
      href: '/account/subscription',
      isActive: pathname === '/account/subscription'
    }
    // {
    //   title: 'Merchant Settings',
    //   icon: Store,
    //   href: '/account/merchant',
    //   isActive: pathname === '/account/merchant'
    // }
  ];

  // For desktop view
  return (
    <div className="fixed top-[calc(theme(spacing.16)+theme(spacing.9))] hidden h-[calc(100vh-theme(spacing.16)-theme(spacing.9))] w-[280px] flex-col overflow-hidden border-r bg-sidebar lg:flex">
      <div className="flex items-center gap-2 border-b px-6 py-4 font-semibold">
        <Settings className="h-6 w-6" />
        <span>Account Settings</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              item.isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => logout()}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}
