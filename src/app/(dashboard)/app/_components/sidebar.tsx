'use client';

import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserMenu } from './user-memu';

import { cn } from '@/lib/utils/cn';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

import { NAV_ITEMS } from '@/constants/nav';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar variant="sidebar">
      <SidebarContent className="flex h-full flex-col pt-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem key="ダッシュボード">
              <SidebarMenuButton asChild>
                <Link
                  key="ダッシュボード"
                  href="/app"
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-md hover:bg-muted/80',
                    pathname == '/app' && 'bg-muted font-semibold'
                  )}
                  aria-label={`ダッシュボードページへ移動`}
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  <span>ダッシュボード</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>タスク</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-md hover:bg-muted/80',
                        pathname == item.href && 'bg-muted font-semibold'
                      )}
                      aria-label={`${item.title}ページへ移動`}
                    >
                      <item.icon className="mr-2 size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="border-t p-3">
          <SidebarMenuItem className="w-full justify-start">
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
