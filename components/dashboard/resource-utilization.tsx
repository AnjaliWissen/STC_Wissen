'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

export function ResourceUtilization() {
  const { data: nodes, isLoading } = useQuery({
    queryKey: ['resource-utilization'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fabric_nodes')
        .select('*')
        .eq('status', 'online');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const avgCPU = nodes && nodes.length > 0
    ? nodes.reduce((sum, n) => sum + Number(n.cpu_usage), 0) / nodes.length
    : 0;

  const avgMemory = nodes && nodes.length > 0
    ? nodes.reduce((sum, n) => sum + Number(n.memory_usage), 0) / nodes.length
    : 0;

  const avgStorage = nodes && nodes.length > 0
    ? nodes.reduce((sum, n) => sum + Number(n.storage_usage), 0) / nodes.length
    : 0;

  const getUtilizationColor = (value: number) => {
    if (value >= 80) return 'text-red-600';
    if (value >= 60) return 'text-amber-600';
    return 'text-green-600';
  };

  const resources = [
    {
      label: 'CPU Usage',
      value: avgCPU,
      icon: Cpu,
      color: 'bg-blue-500',
    },
    {
      label: 'Memory Usage',
      value: avgMemory,
      icon: MemoryStick,
      color: 'bg-purple-500',
    },
    {
      label: 'Storage Usage',
      value: avgStorage,
      icon: HardDrive,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <CardTitle>Resource Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div key={resource.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">{resource.label}</span>
                  </div>
                  <span className={`text-lg font-bold ${getUtilizationColor(resource.value)}`}>
                    {resource.value.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${resource.color} transition-all duration-300`}
                    style={{ width: `${Math.min(resource.value, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {nodes && nodes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No active nodes
          </div>
        )}
      </CardContent>
    </Card>
  );
}
