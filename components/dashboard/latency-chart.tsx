'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LatencyChart() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['latency-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('network_metrics')
        .select('*')
        .eq('metric_type', 'latency')
        .order('timestamp', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const avgLatency = metrics && metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length).toFixed(2)
    : '0.00';

  if (isLoading) {
    return (
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Average Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Average Latency</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{avgLatency}ms</div>
            <div className="text-xs text-gray-500">Average Response Time</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center border rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-600 mb-2">{avgLatency}ms</div>
            <div className="text-sm text-gray-600">Average Response Time</div>
            <div className="text-xs text-gray-500 mt-2">{metrics?.length || 0} data points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
