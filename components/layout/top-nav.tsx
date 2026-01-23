// 'use client';

// import { Search, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { ThemeToggle } from './theme-toggle';

// export function TopNav() {
//   const { data: networkStatus } = useQuery({
//     queryKey: ['network-status'],
//     queryFn: async () => {
//       const { data: nodes } = await supabase
//         .from('fabric_nodes')
//         .select('status');

//       const onlineCount = nodes?.filter(n => n.status === 'online').length || 0;
//       const totalCount = nodes?.length || 0;
//       const allOnline = onlineCount === totalCount && totalCount > 0;

//       return { allOnline, onlineCount, totalCount };
//     },
//   });

//   return (
//     <div className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
//       <div className="flex h-16 items-center px-6 gap-6">
//         <div className="flex items-center gap-3">
//           <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//           <h1 className="text-xl font-semibold dark:text-white">Blockchain Monitor</h1>
//         </div>

//         <div className="flex items-center gap-2 ml-4">
//           {networkStatus?.allOnline ? (
//             <>
//               <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
//               <span className="text-sm font-medium text-green-700 dark:text-green-300">All Systems Operational</span>
//             </>
//           ) : (
//             <>
//               <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
//               <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
//                 {networkStatus?.onlineCount}/{networkStatus?.totalCount} Nodes Online
//               </span>
//             </>
//           )}
//         </div>

//         <div className="flex-1 max-w-xl ml-auto">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
//             <Input
//               placeholder="Search by Transaction ID, Hash, User ID..."
//               className="pl-10"
//             />
//           </div>
//         </div>

//         <ThemeToggle />
//       </div>
//     </div>
//   );
// }
'use client';

import { Search, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from './theme-toggle';

const BASE_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

interface NetworkStatus {
  allOnline: boolean;
  onlineCount: number;
  totalCount: number;
}

export function TopNav() {
  const { data: networkStatus, isLoading, isError } = useQuery<NetworkStatus>({
    queryKey: ['network-status'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/system/health`);
      if (!res.ok) {
        throw new Error('Failed to fetch network status');
      }

      const data = await res.json();

      const containers = data.containers || [];
      const onlineCount = containers.filter(
        (c: any) => c.state === 'running'
      ).length;
      const totalCount = containers.length;
      const allOnline = totalCount > 0 && onlineCount === totalCount;

      return { allOnline, onlineCount, totalCount };
    },
    refetchInterval: 10_000, // auto-refresh every 10s
  });

  return (
    <div className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-16 items-center px-6 gap-6">
        {/* App Title */}
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Blockchain Monitor
          </h1>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2 ml-4">
          {isLoading && (
            <span className="text-sm text-gray-500">
              Checking system health…
            </span>
          )}

          {!isLoading && !isError && networkStatus && (
            <>
              {networkStatus.allOnline ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    All Systems Operational
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {networkStatus.onlineCount}/{networkStatus.totalCount} Nodes Online
                  </span>
                </>
              )}
            </>
          )}

          {isError && (
            <span className="text-sm font-medium text-red-600">
              Health check failed
            </span>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search by Transaction ID, Hash, User ID..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
