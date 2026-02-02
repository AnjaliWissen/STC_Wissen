'use client';

import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Shield, Lock, Activity, Zap, Cpu ,Gauge,Box   } from 'lucide-react';
import { useState } from 'react';

//   TypeScript interfaces for Fabric node status structure
interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  uptime: string;
  ports: string;
}

interface Stats {
  name: string;
  cpu: number;
  memory: string;
  memoryPercent: number;
  network: string;
  block: string;
  pids: number;
}

interface Peer {
  name: string;
  port: number;
  status: string;
  recentLogs: string[];
}

interface Orderer {
  name: string;
  port: number;
  status: string;
  recentLogs: string[];
}

interface NodeStatusResponse {
  status: string;
  timestamp: string;
  containers: Container[];
  // stats: Stats[];
  // peers: Peer[];
  // orderers: Orderer[];
}

interface NodeStatusResponse {
  status: string;
  timestamp: string;
  containers: Container[];
  stats: Stats[];
}



const API_ENDPOINT = 'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

export function NodeStatusGrid() {
  //   Fetch node data with proper typing and fallback to dummy data
  const { data: nodes, isLoading } = useQuery<NodeStatusResponse>({
    queryKey: ['fabric-nodes'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/system/health`);
        if (!response.ok) throw new Error('Failed to fetch nodes');
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn('Using dummy data:', error);
        // return nodeStatusGridExample;
      }
    },
  });

  const statsMap = new Map(
  (nodes?.stats ?? []).map(stat => [stat.name, stat])
);

  //   Helper function to get stats for a container
  // const getStatsForContainer = (containerName: string): Stats | undefined => {
  //   return nodes?.stats.find((s) => s.name === containerName);
  // };

  //   Helper function to determine node type from container image
  // const getNodeTypeFromImage = (image: string): string => {
  //   if (image.includes('orderer')) return 'orderer';
  //   if (image.includes('peer')) return 'peer';
  //   if (image.includes('ca')) return 'ca';
  //   return 'unknown';
  // };

  const getNodeType = (image: string, name: string): string => {
      const img = image.toLowerCase();
      const nodeName = name.toLowerCase();

      // Orderer checks
      if (
        img.includes('orderer') ||
        nodeName.endsWith('order') ||
        nodeName.endsWith('orderer')
      ) {
        return 'orderer';
      }

      // Peer: keep as-is (image based)
      if (img.includes('peer')) {
        return 'peer';
      }

      // CA: KEEP EXACTLY AS-IS
      if (img.includes('ca')) {
        return 'ca';
      }

      return 'unknown';
    };

    const getNodeRoles = (image: string, name: string): string[] => {
  const img = image.toLowerCase();
  const nodeName = name.toLowerCase();

  const roles: string[] = [];

  // Orderer logic
  if (
    img.includes('orderer') ||
    nodeName.endsWith('order') ||
    nodeName.endsWith('orderer') ||
    nodeName.includes('orderer')
  ) {
    roles.push('orderer');
  }

  // Peer logic (unchanged)
  if (img.includes('peer')) {
    roles.push('peer');
  }

  // CA logic (UNCHANGED, image-based only)
  if (img.includes('ca')) {
    roles.push('ca');
  }

  return roles.length ? roles : ['unknown'];
};



  // Helper function to map node type to icon component
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'peer':
        return Server;
      case 'orderer':
        return Shield;
      case 'ca':
        return Lock;
      default:
        return Server;
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return {
          badge: 'success',
          border: 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
          glow: 'shadow-green-100 dark:shadow-green-900/50',
          pulse: true,
        };
      case 'offline':
        return {
          badge: 'destructive',
          border: 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950',
          glow: 'shadow-red-100 dark:shadow-red-900/50',
          pulse: false,
        };
      case 'syncing':
        return {
          badge: 'secondary',
          border: 'border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
          glow: 'shadow-amber-100 dark:shadow-amber-900/50',
          pulse: true,
        };
      default:
        return {
          badge: 'secondary',
          border: 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800',
          glow: 'shadow-gray-100 dark:shadow-gray-900/50',
          pulse: false,
        };
    }
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Node Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }



  // const groupedNodeData =
  // nodes?.containers.reduce((acc: Record<string, any[]>, container) => {
  //   const nodeType = getNodeType(container.image, container.name);
  //   if (!acc[nodeType]) acc[nodeType] = [];

  //   const stats = statsMap.get(container.name);

  //   acc[nodeType].push({
  //     id: container.id,
  //     node_name: container.name,
  //     host: container.ports,
  //     status: container.state,
  //     uptime: container.uptime,
  //     image: container.image,

  //     // attach stats safely
  //     stats,
  //   });

  //   return acc;
  // }, { peer: [], orderer: [], ca: [] }) || { peer: [], orderer: [], ca: [] };

  const groupedNodeData =
  nodes?.containers.reduce(
    (acc: Record<string, any[]>, container) => {
      const roles = getNodeRoles(container.image, container.name);
      const stats = statsMap.get(container.name);

      roles.forEach((role) => {
        if (!acc[role]) acc[role] = [];

        acc[role].push({
          id: container.id,
          node_name: container.name,
          host: container.ports,
          status: container.state,
          uptime: container.uptime,
          image: container.image,
          stats,
        });
      });

      return acc;
    },
    { peer: [], orderer: [], ca: [] }
  ) || { peer: [], orderer: [], ca: [] };



const onlineCount = nodes?.containers?.filter(n => n.state === 'running').length || 0;
const totalCount = nodes?.containers?.length || 0;

    const NODE_TYPE_LABELS: Record<string, string> = {
      peer: 'Peer Nodes',
      orderer: 'Orderer Nodes',
      ca: 'CASS',
    };


  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
  
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Blockchain Node Network
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {onlineCount} of {totalCount} nodes operational
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedNodeData).map(([type, typeNodes]) => {
            const Icon = getNodeIcon(type);
            const typeOnline = typeNodes.filter(n => n.status === 'running').length;

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-sm uppercase text-gray-700 dark:text-gray-300">
                    {NODE_TYPE_LABELS[type] ?? `${type} Nodes`}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {typeOnline}/{typeNodes.length} active
                  </span>
                </div>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"> */}
                <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                  auto-rows-fr
                "
              >


                  {typeNodes.map((node) => {
                    const styles = getStatusColor(node.status);

                    return (
                      // <div
                      //   key={node.id}
                      //   className={`relative border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${styles.border} ${styles.glow}`}
                      // >
                      <div
  key={node.id}
  className={`
    relative
    border-2
    rounded-xl
    p-4
    transition-all
    duration-300
    hover:shadow-lg
    hover:scale-[1.02]
    sm:hover:scale-105
    max-w-full
    overflow-visible
    ${styles.border}
    ${styles.glow}
  `}
>

                        {styles.pulse && (
                          <div className="absolute -top-1 -right-1">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 break-all">
                              {node.node_name}
                            </div>
                            {/* <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {node.host}
                            </div> */}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs break-all">
                            {/* <Cpu className="h-3 w-3 text-gray-400 dark:text-gray-500" /> */}
                            <span className="text-gray-600 dark:text-gray-300">
                              {/* Block: {node.current_block_height?.toLocaleString() || 'N/A'} */}
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-xs break-all">
                                  <Cpu className="h-3 w-3 text-gray-400" />
                                  <span>
                                    CPU: {node.stats?.cpu ?? 0}%
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs break-all">
                                  <Zap className="h-3 w-3 text-gray-400" />
                                  <span className="break-all">
                                Memory: {node.stats?.memory ?? 'N/A'}
                              </span>

                                </div>

                                <div className="flex items-start gap-2 text-xs break-all">
                                  <Gauge  className="h-3 w-3 text-gray-400" />
                                  <span>
                                    Memory % : {node.stats?.memoryPercent ?? 'N/A'}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs break-all">
                                  <Activity className="h-3 w-3 text-gray-400" />
                                  <span>
                                    Network: {node.stats?.network ?? 'N/A'}
                                  </span>
                                </div>

                                 <div className="flex items-start gap-2 text-xs break-all">
                                  <Box  className="h-3 w-3 text-gray-400" />
                                  <span>
                                    Block: {node.stats?.block ?? 'N/A'}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs break-all">
                                  <Server className="h-3 w-3 text-gray-400" />
                                  <span>
                                    PIDs: {node.stats?.pids ?? 'N/A'}
                                  </span>
                                </div>
                              </div>

                            </span>
                          </div>

                          {/* <div className="flex items-start gap-2 text-xs break-all">
                            <Zap className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {node.response_time_ms}ms
                            </span>
                          </div> */}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Badge
                            variant={styles.badge as any}
                            className="text-xs font-semibold w-full justify-center"
                          >
                            {node.status === 'syncing' && (
                              <Activity className="h-3 w-3 mr-1 animate-pulse" />
                            )}
                            {node.status.toUpperCase()}
                          </Badge>



                        


                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {nodes && nodes.containers.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Server className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No nodes configured</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Connect your blockchain nodes to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

 
  
}
