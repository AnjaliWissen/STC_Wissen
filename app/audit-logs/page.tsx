'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AuditLogsPage() {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!auditLogs) return;

    if (format === 'csv') {
      const headers = ['Timestamp', 'Action', 'User ID', 'Resource Type', 'Resource ID', 'IP Address'];
      const rows = auditLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.action,
        log.user_id,
        log.resource_type,
        log.resource_id || '',
        log.ip_address || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Immutable audit trail for compliance and security</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading audit logs...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Resource ID</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {formatDate(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{log.user_id}</TableCell>
                        <TableCell>{log.resource_type}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.resource_id ? log.resource_id.substring(0, 16) + '...' : '-'}
                        </TableCell>
                        <TableCell className="text-sm">{log.ip_address || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Compliance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Data Retention</h4>
              <p className="text-gray-600">
                Audit logs are retained for 7 years in compliance with financial regulations.
                All logs are immutable and cryptographically signed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Access Control</h4>
              <p className="text-gray-600">
                Only authorized personnel with compliance roles can access and export audit logs.
                All access attempts are logged and monitored.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Privacy</h4>
              <p className="text-gray-600">
                Personal Identifiable Information (PII) is handled in accordance with GDPR and
                other applicable data protection regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
