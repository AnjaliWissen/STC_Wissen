'use client';

import { Search, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from './theme-toggle';

export function TopNav() {
  const { data: networkStatus } = useQuery({
    queryKey: ['network-status'],
    queryFn: async () => {
      const { data: nodes } = await supabase
        .from('fabric_nodes')
        .select('status');

      const onlineCount = nodes?.filter(n => n.status === 'online').length || 0;
      const totalCount = nodes?.length || 0;
      const allOnline = onlineCount === totalCount && totalCount > 0;

      return { allOnline, onlineCount, totalCount };
    },
  });

  return (
    <div className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center px-6 gap-6">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold dark:text-white">Blockchain Monitor</h1>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {networkStatus?.allOnline ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">All Systems Operational</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                {networkStatus?.onlineCount}/{networkStatus?.totalCount} Nodes Online
              </span>
            </>
          )}
        </div>

        <div className="flex-1 max-w-xl ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search by Transaction ID, Hash, User ID..."
              className="pl-10"
            />
          </div>
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
