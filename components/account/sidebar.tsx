'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  LogOut,
  User,
  Webhook,
  Settings,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  isActive: boolean;
}

export function AccountSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth();
  const { toast } = useToast();
  const menuItems: MenuItem[] = [
    {
      title: 'General',
      icon: User,
      href: '/account',
      isActive: pathname === '/account'
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
    <div className="fixed top-[calc(theme(spacing.16)+theme(spacing.9))] hidden h-[calc(100vh-theme(spacing.16)-theme(spacing.9))] w-[280px] flex-col overflow-hidden border-r bg-card lg:flex">
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
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
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
