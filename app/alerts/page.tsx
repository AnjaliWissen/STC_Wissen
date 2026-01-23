// 'use client';

// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { AlertCircle, Bell, CheckCircle2, Plus } from 'lucide-react';
// import { format } from 'date-fns';
// import { AlertRuleDialog } from '@/components/alerts/alert-rule-dialog';

// export default function AlertsPage() {
//   const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
//   const queryClient = useQueryClient();

//   const { data: alerts, isLoading: alertsLoading } = useQuery({
//     queryKey: ['alerts'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('alerts')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(50);

//       if (error) throw error;
//       return data;
//     },
//   });

//   const { data: alertRules, isLoading: rulesLoading } = useQuery({
//     queryKey: ['alert-rules'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('alert_rules')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       return data;
//     },
//   });

//   const acknowledgeMutation = useMutation({
//     mutationFn: async (alertId: string) => {
//       const { error } = await supabase
//         .from('alerts')
//         .update({
//           acknowledged: true,
//           acknowledged_by: 'System Admin',
//           acknowledged_at: new Date().toISOString(),
//         })
//         .eq('id', alertId);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//     },
//   });

//   const resolveMutation = useMutation({
//     mutationFn: async (alertId: string) => {
//       const { error } = await supabase
//         .from('alerts')
//         .update({
//           resolved: true,
//           resolved_at: new Date().toISOString(),
//         })
//         .eq('id', alertId);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//     },
//   });

//   const toggleRuleMutation = useMutation({
//     mutationFn: async ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) => {
//       const { error } = await supabase
//         .from('alert_rules')
//         .update({ enabled: !enabled })
//         .eq('id', ruleId);

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
//     },
//   });

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case 'critical':
//         return 'destructive';
//       case 'warning':
//         return 'outline';
//       case 'info':
//         return 'secondary';
//       default:
//         return 'secondary';
//     }
//   };

//   const activeAlerts = alerts?.filter(a => !a.resolved) || [];
//   const resolvedAlerts = alerts?.filter(a => a.resolved) || [];

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts & Incident Management</h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">Threshold-based notifications and monitoring</p>
//         </div>
//         <Button variant="purple" onClick={() => setRuleDialogOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           New Alert Rule
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</div>
//                 <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{activeAlerts.length}</div>
//               </div>
//               <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Unacknowledged</div>
//                 <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
//                   {activeAlerts.filter(a => !a.acknowledged).length}
//                 </div>
//               </div>
//               <Bell className="h-12 w-12 text-amber-600 dark:text-amber-400" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Resolved Today</div>
//                 <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
//                   {resolvedAlerts.filter(a =>
//                     new Date(a.resolved_at!).toDateString() === new Date().toDateString()
//                   ).length}
//                 </div>
//               </div>
//               <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="active" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="active">Active Alerts</TabsTrigger>
//           <TabsTrigger value="resolved">Resolved</TabsTrigger>
//           <TabsTrigger value="rules">Alert Rules</TabsTrigger>
//         </TabsList>

//         <TabsContent value="active">
//           <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//             <CardHeader>
//               <CardTitle>Active Alerts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {alertsLoading ? (
//                 <div className="text-center py-8 text-gray-500">Loading...</div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Severity</TableHead>
//                         <TableHead>Title</TableHead>
//                         <TableHead>Message</TableHead>
//                         <TableHead>Created</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {activeAlerts.length > 0 ? (
//                         activeAlerts.map((alert) => (
//                           <TableRow key={alert.id}>
//                             <TableCell>
//                               <Badge variant={getSeverityColor(alert.severity)}>
//                                 {alert.severity}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="font-medium">{alert.title}</TableCell>
//                             <TableCell className="max-w-md truncate">{alert.message}</TableCell>
//                             <TableCell className="text-sm">
//                               {format(new Date(alert.created_at), 'MMM dd, HH:mm')}
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex gap-2">
//                                 {!alert.acknowledged && (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => acknowledgeMutation.mutate(alert.id)}
//                                   >
//                                     Acknowledge
//                                   </Button>
//                                 )}
//                                 <Button
//                                   size="sm"
//                                   variant="purple"
//                                   onClick={() => resolveMutation.mutate(alert.id)}
//                                 >
//                                   Resolve
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={5} className="text-center py-8 text-gray-500">
//                             No active alerts
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="resolved">
//           <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//             <CardHeader>
//               <CardTitle>Resolved Alerts</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Severity</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Created</TableHead>
//                       <TableHead>Resolved</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {resolvedAlerts.length > 0 ? (
//                       resolvedAlerts.map((alert) => (
//                         <TableRow key={alert.id}>
//                           <TableCell>
//                             <Badge variant={getSeverityColor(alert.severity)}>
//                               {alert.severity}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="font-medium">{alert.title}</TableCell>
//                           <TableCell className="text-sm">
//                             {format(new Date(alert.created_at), 'MMM dd, HH:mm')}
//                           </TableCell>
//                           <TableCell className="text-sm">
//                             {format(new Date(alert.resolved_at!), 'MMM dd, HH:mm')}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={4} className="text-center py-8 text-gray-500">
//                           No resolved alerts
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="rules">
//           <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//             <CardHeader>
//               <CardTitle>Alert Rules Configuration</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {rulesLoading ? (
//                 <div className="text-center py-8 text-gray-500">Loading...</div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Rule Name</TableHead>
//                         <TableHead>Metric</TableHead>
//                         <TableHead>Condition</TableHead>
//                         <TableHead>Threshold</TableHead>
//                         <TableHead>Severity</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {alertRules && alertRules.length > 0 ? (
//                         alertRules.map((rule) => (
//                           <TableRow key={rule.id}>
//                             <TableCell className="font-medium">{rule.name}</TableCell>
//                             <TableCell>{rule.metric}</TableCell>
//                             <TableCell>{rule.condition.toUpperCase()}</TableCell>
//                             <TableCell>{rule.threshold}</TableCell>
//                             <TableCell>
//                               <Badge variant={getSeverityColor(rule.severity)}>
//                                 {rule.severity}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant={rule.enabled ? 'default' : 'secondary'}>
//                                 {rule.enabled ? 'Enabled' : 'Disabled'}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   toggleRuleMutation.mutate({
//                                     ruleId: rule.id,
//                                     enabled: rule.enabled,
//                                   })
//                                 }
//                               >
//                                 {rule.enabled ? 'Disable' : 'Enable'}
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={7} className="text-center py-8 text-gray-500">
//                             No alert rules configured
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <AlertRuleDialog open={ruleDialogOpen} onClose={() => setRuleDialogOpen(false)} />
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bell, CheckCircle2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { AlertRuleDialog } from '@/components/alerts/alert-rule-dialog';

const API_ENDPOINT =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

/* ---------- THEME (same as FX / Alerts v1) ---------- */
const themedCard =
  'rounded-lg border bg-card text-card-foreground shadow-sm ' +
  'bg-gradient-to-br from-white to-gray-50/50 ' +
  'dark:from-gray-800 dark:to-gray-900/50';

/* ---------- TYPES ---------- */
type Severity = 'low' | 'medium' | 'high' | 'critical';

type AlertStatus = 'active' | 'acknowledged' | 'resolved';

type Alert = {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  status: AlertStatus;
  createdAt: string;
  resolvedAt: string | null;
};

type AlertsApiResponse = {
  counts: {
    active: number;
    acknowledged: number;
    resolved: number;
  };
  alerts: Alert[];
};

type AlertRuleUI = {
  key: string;
  enabled: boolean;
  severity: Severity;
  details: string;
};

/* ---------- HELPERS ---------- */
const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'outline';
    case 'medium':
    case 'low':
    default:
      return 'secondary';
  }
};

const getSeverityBadgeClass = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'medium':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'low':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/* =================================================== */

export default function AlertsPage() {
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  /* ---------- ALERTS ---------- */
  const { data, isLoading: alertsLoading } = useQuery<AlertsApiResponse>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINT}/alerts`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    },
  });

  const alerts = data?.alerts ?? [];
  const activeAlerts = alerts.filter(
    (a) => a.status === 'active' || a.status === 'acknowledged'
  );
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved');

  /* ---------- ALERT CONFIG ---------- */
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['alert-config'],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINT}/alerts/config`);
      if (!res.ok) throw new Error('Failed to fetch alert configuration');
      return res.json();
    },
  });

  const alertRules: AlertRuleUI[] = rulesData
    ? Object.entries(rulesData.configuration).map(([key, cfg]: any) => {
        let details = '';
        if ('threshold' in cfg) details = `Threshold: ${cfg.threshold}`;
        else if ('timeoutMinutes' in cfg)
          details = `Timeout: ${cfg.timeoutMinutes} min`;
        else if ('thresholdKWD' in cfg)
          details = `KWD: ${cfg.thresholdKWD}, BHD: ${cfg.thresholdBHD}`;
        else if ('countThreshold' in cfg)
          details = `Count: ${cfg.countThreshold}`;

        return {
          key,
          enabled: cfg.enabled,
          severity: cfg.severity,
          details,
        };
      })
    : [];

  /* ---------- MUTATIONS ---------- */
  const acknowledgeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_ENDPOINT}/alerts/${id}/acknowledge`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acknowledgedBy: 'admin',
          notes: 'Acknowledged from UI',
        }),
      });
      if (!res.ok) throw new Error('Failed to acknowledge');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_ENDPOINT}/alerts/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolvedBy: 'admin',
          notes: 'Resolved from UI',
        }),
      });
      if (!res.ok) throw new Error('Failed to resolve');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const updateAlertConfigMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${API_ENDPOINT}/alerts/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update config');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['alert-config'] }),
  });

  const toggleRuleEnabled = (key: string, enabled: boolean) => {
    updateAlertConfigMutation.mutate({
      [key]: { enabled: !enabled },
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alerts & Incident Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Threshold-based notifications and monitoring
          </p>
        </div>
        <Button variant="purple" onClick={() => setRuleDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Alert Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={themedCard}>
          <CardContent className="pt-6 flex justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Alerts
              </div>
              <div className="text-3xl font-bold text-red-600 mt-1">
                {data?.counts.active ?? 0}
              </div>
            </div>
            <AlertCircle className="h-12 w-12 text-red-600" />
          </CardContent>
        </Card>

        <Card className={themedCard}>
          <CardContent className="pt-6 flex justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Acknowledged
              </div>
              <div className="text-3xl font-bold text-amber-600 mt-1">
                {data?.counts.acknowledged ?? 0}
              </div>
            </div>
            <Bell className="h-12 w-12 text-amber-600" />
          </CardContent>
        </Card>

        <Card className={themedCard}>
          <CardContent className="pt-6 flex justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Resolved
              </div>
              <div className="text-3xl font-bold text-green-600 mt-1">
                {data?.counts.resolved ?? 0}
              </div>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        {/* Active */}
        <TabsContent value="active">
          <Card className={themedCard}>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading…</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Severity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <Badge
                              className={`rounded-full border capitalize ${getSeverityBadgeClass(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {alert.type.toUpperCase()}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {alert.message}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(
                              new Date(alert.createdAt),
                              'MMM dd, HH:mm'
                            )}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            {alert.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  acknowledgeMutation.mutate(alert.id)
                                }
                              >
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="purple"
                              onClick={() =>
                                resolveMutation.mutate(alert.id)
                              }
                            >
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolved */}
        <TabsContent value="resolved">
          <Card className={themedCard}>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Resolved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Badge
                            variant={getSeverityColor(alert.severity)}
                          >
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {alert.type.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(
                            new Date(alert.createdAt),
                            'MMM dd, HH:mm'
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {alert.resolvedAt
                            ? format(
                                new Date(alert.resolvedAt),
                                'MMM dd, HH:mm'
                              )
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules">
          <Card className={themedCard}>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="text-center py-8 text-gray-500">Loading…</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rule</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertRules.map((rule) => (
                        <TableRow key={rule.key}>
                          <TableCell className="font-medium capitalize">
                            {rule.key.replace(/([A-Z])/g, ' $1')}
                          </TableCell>
                          <TableCell>{rule.details}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getSeverityColor(rule.severity)}
                              className="capitalize"
                            >
                              {rule.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                rule.enabled ? 'default' : 'secondary'
                              }
                            >
                              {rule.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                updateAlertConfigMutation.isPending
                              }
                              onClick={() =>
                                toggleRuleEnabled(rule.key, rule.enabled)
                              }
                            >
                              {rule.enabled ? 'Disable' : 'Enable'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertRuleDialog
        open={ruleDialogOpen}
        onClose={() => setRuleDialogOpen(false)}
      />
    </div>
  );
}
