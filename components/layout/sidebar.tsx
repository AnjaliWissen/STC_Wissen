'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  ArrowLeftRight,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Activity,
  },
  {
    title: 'FX & Liquidity',
    href: '/fx-liquidity',
    icon: ArrowLeftRight,
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: Bell,
    badge: true,
  },
  // {
  //   title: 'Audit Logs',
  //   href: '/audit-logs',
  //   icon: FileText,
  // },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'System Settings',
    href: '/system-settings',
    icon: Wrench,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const { data: unacknowledgedAlerts } = useQuery({
    queryKey: ['unacknowledged-alerts'],
    queryFn: async () => {
      const { count } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);
      return count || 0;
    },
  });

  return (
    // <div className={cn(
    //   'border-r bg-gray-50 dark:bg-gray-800 dark:border-gray-700 h-[calc(100vh-4rem)] transition-all duration-300 relative',
    //   isCollapsed ? 'w-16' : 'w-64'
    // )}>
    <div
      className={cn(
        'border-r bg-gray-50 dark:bg-gray-800 dark:border-gray-700 h-stretch transition-all duration-300 relative',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-white dark:bg-gray-700 dark:border-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <nav className="p-4 space-y-1">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 whitespace-nowrap">{item.title}</span>
                    {item.badge && (unacknowledgedAlerts ?? 0) > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unacknowledgedAlerts}
                      </Badge>
                    )}
                  </>
                )}
                {isCollapsed && item.badge && (unacknowledgedAlerts ?? 0) > 0 && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      {linkContent}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                    {item.badge && (unacknowledgedAlerts ?? 0) > 0 && (
                      <span className="ml-2 text-red-500">({unacknowledgedAlerts})</span>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
}
