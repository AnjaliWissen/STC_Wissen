'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Shield, Lock, Activity, Zap, Cpu } from 'lucide-react';

export function NodeStatusGrid() {
  const { data: nodes, isLoading } = useQuery({
    queryKey: ['fabric-nodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fabric_nodes')
        .select('*')
        .order('node_type', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'online':
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
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Blockchain Node Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading nodes...</div>
        </CardContent>
      </Card>
    );
  }

  const groupedNodes = {
    peer: nodes?.filter(n => n.node_type === 'peer') || [],
    orderer: nodes?.filter(n => n.node_type === 'orderer') || [],
    ca: nodes?.filter(n => n.node_type === 'ca') || [],
  };

  const onlineCount = nodes?.filter(n => n.status === 'online').length || 0;
  const totalCount = nodes?.length || 0;

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
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
          {Object.entries(groupedNodes).map(([type, typeNodes]) => {
            const Icon = getNodeIcon(type);
            const typeOnline = typeNodes.filter(n => n.status === 'online').length;

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-sm uppercase text-gray-700 dark:text-gray-300">
                      {type} Nodes
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {typeOnline}/{typeNodes.length} active
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {typeNodes.map((node) => {
                    const styles = getStatusStyles(node.status);

                    return (
                      <div
                        key={node.id}
                        className={`relative border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${styles.border} ${styles.glow}`}
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
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                              {node.node_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {node.host}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Cpu className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Block: {node.current_block_height?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Zap className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {node.response_time_ms}ms
                            </span>
                          </div>
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

        {nodes && nodes.length === 0 && (
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
