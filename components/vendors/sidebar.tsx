'use client';

import {
  BadgePercent,
  CheckSquare,
  LineChart,
  MessageSquare,
  ShoppingCart,
  Store,
  Tags,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types/navigation';

export function VendorSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const menuItems: MenuItem[] = [
    {
      title: 'Overview',
      icon: LineChart,
      href: '/vendors/dashboard',
      isActive: pathname === '/vendors/dashboard'
    },
    {
      title: 'Users',
      icon: Users,
      href: '/vendors/dashboard/users',
      isActive: pathname === '/vendors/dashboard/users'
    },
    {
      title: 'TCGs',
      icon: Tags,
      href: '/vendors/dashboard/tcgs',
      isActive: pathname === '/vendors/dashboard/tcgs'
    },
    {
      title: 'Vendors',
      icon: Store,
      href: '/vendors/dashboard/vendors',
      isActive: pathname === '/vendors/dashboard/vendors'
    },
    {
      title: 'Buylists',
      icon: ShoppingCart,
      href: '/vendors/dashboard/buylists',
      isActive: pathname === '/vendors/dashboard/buylists'
    },
    {
      title: 'Advertisements',
      icon: MessageSquare,
      href: '/vendors/dashboard/settings/advertisements',
      isActive: pathname === '/vendors/dashboard/settings/advertisements'
    },
    {
      title: 'Discounts',
      icon: BadgePercent,
      href: '/vendors/dashboard/settings/discounts',
      isActive: pathname === '/vendors/dashboard/settings/discounts'
    }
    // {
    //   title: 'Merchant Settings',
    //   icon: Store,
    //   href: '/account/merchant',
    //   isActive: pathname === '/account/merchant'
    // }
  ];

  // Add Approvals menu item only for admins
  if (isAdmin) {
    menuItems.push({
      title: 'Approvals',
      icon: CheckSquare,
      href: '/vendors/dashboard/settings/approvals',
      isActive: pathname === '/vendors/dashboard/settings/approvals'
    });
  }

  // For desktop view
  return (
    <div className="fixed top-[calc(theme(spacing.16)+theme(spacing.9))] hidden h-[calc(100vh-theme(spacing.16)-theme(spacing.9))] w-[280px] flex-col overflow-hidden border-r bg-sidebar lg:flex">
      <div className="flex items-center gap-2 border-b px-6 py-4 font-semibold">
        <span>Analytics Dashboard</span>
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
    </div>
  );
}
