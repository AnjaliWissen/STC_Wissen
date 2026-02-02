// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

// export function ResourceUtilization() {
//   const { data: nodes, isLoading } = useQuery({
//     queryKey: ['resource-utilization'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('fabric_nodes')
//         .select('*')
//         .eq('status', 'online');

//       if (error) throw error;
//       return data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//         <CardHeader>
//           <CardTitle>Resource Utilization</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-8 text-gray-500">Loading...</div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const avgCPU = nodes && nodes.length > 0
//     ? nodes.reduce((sum, n) => sum + Number(n.cpu_usage), 0) / nodes.length
//     : 0;

//   const avgMemory = nodes && nodes.length > 0
//     ? nodes.reduce((sum, n) => sum + Number(n.memory_usage), 0) / nodes.length
//     : 0;

//   const avgStorage = nodes && nodes.length > 0
//     ? nodes.reduce((sum, n) => sum + Number(n.storage_usage), 0) / nodes.length
//     : 0;

//   const getUtilizationColor = (value: number) => {
//     if (value >= 80) return 'text-red-600';
//     if (value >= 60) return 'text-amber-600';
//     return 'text-green-600';
//   };

//   const resources = [
//     {
//       label: 'CPU Usage',
//       value: avgCPU,
//       icon: Cpu,
//       color: 'bg-blue-500',
//     },
//     {
//       label: 'Memory Usage',
//       value: avgMemory,
//       icon: MemoryStick,
//       color: 'bg-purple-500',
//     },
//     {
//       label: 'Storage Usage',
//       value: avgStorage,
//       icon: HardDrive,
//       color: 'bg-orange-500',
//     },
//   ];

//   return (
//     <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//       <CardHeader>
//         <CardTitle>Resource Utilization</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           {resources.map((resource) => {
//             const Icon = resource.icon;
//             return (
//               <div key={resource.label}>
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <Icon className="h-5 w-5 text-gray-600" />
//                     <span className="text-sm font-medium">{resource.label}</span>
//                   </div>
//                   <span className={`text-lg font-bold ${getUtilizationColor(resource.value)}`}>
//                     {resource.value.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full ${resource.color} transition-all duration-300`}
//                     style={{ width: `${Math.min(resource.value, 100)}%` }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {nodes && nodes.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No active nodes
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Activity, Zap, Layers } from 'lucide-react';

const API_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/system/metrics';

/* ---------------- Helpers ---------------- */

const getLoadStyle = (cpu: number) => {
  if (cpu > 1.5) {
    return {
      border: 'border-red-200 dark:border-red-700 bg-gradient-to-br from-white to-red-50/40 dark:from-gray-800 dark:to-gray-900',
      badge: 'destructive',
    };
  }

  if (cpu > 0) {
    return {
      border: 'border-green-200 dark:border-green-700 bg-gradient-to-br from-white to-green-50/40 dark:from-gray-800 dark:to-gray-900',
      badge: 'success',
    };
  }

  return {
    border: 'border-amber-200 dark:border-amber-700 bg-gradient-to-br from-white to-amber-50/40 dark:from-gray-800 dark:to-gray-900',
    badge: 'secondary',
  };
};


const extractBlockIO = (block: string) =>
  block?.split('/')[0]?.trim() || 'N/A';

/* ---------------- Component ---------------- */

export function ResourceUtilization() {
  const { data, isLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Loading system metrics…
        </CardContent>
      </Card>
    );
  }

  const containers = data?.containers || [];
  const summary = data?.summary;

  return (
    <div className="space-y-6 p-6">
      {/* -------- Header -------- */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Metrics
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mt-1">
          Real-time container performance overview
        </p>
      </div>

      {/* -------- Summary -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-white to-blue-50/40 dark:from-gray-800 dark:to-blue-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Avg CPU</p>
                <p className="text-xl font-bold">
                  {summary.avgCpu} %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50/40 dark:from-gray-800 dark:to-purple-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Avg Memory</p>
                <p className="text-xl font-bold">
                  {summary.avgMemory} %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-gray-800 dark:to-emerald-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Layers className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500">Containers</p>
                <p className="text-xl font-bold">
                  {summary.totalContainers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* -------- Containers -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {containers.map((c: any) => {
          const style = getLoadStyle(c.cpu);

          return (
            <Card
              key={c.name}
              className={`border-2 rounded-xl ${style.border}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm truncate">
                  {c.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">CPU</span>
                  <span className="font-semibold">{c.cpu}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Memory</span>
                  <span className="font-semibold">
                    {c.memory}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className="font-mono text-xs">
                    {c.network}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Block I/O</span>
                  <span className="font-mono text-xs">
                    {c.block}
                  </span>
                </div>

                {/* <Badge
                  variant={style.badge as any}
                  className="w-full justify-center mt-3"
                >
                  {c.cpu > 0 ? 'Active' : 'Idle'}
                </Badge> */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-300">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

