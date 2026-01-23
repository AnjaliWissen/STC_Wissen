'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRightLeft,
  Send,
  Wallet
} from 'lucide-react';
import { format } from 'date-fns';
import { TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(
          `fabric_hash.ilike.%${searchTerm}%,stellar_hash.ilike.%${searchTerm}%,sender_id.ilike.%${searchTerm}%,recipient_id.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'bridge_locked':
        return 'outline';
      case 'fx_swapping':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'bridge_locked':
        return Wallet;
      case 'fx_swapping':
        return ArrowRightLeft;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction Observability</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">End-to-end tracking of cross-border payment flows</p>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Transaction Ledger</CardTitle>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search by TX ID, Hash, User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading transactions...</div>
          ) : (
            <div className="rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableHead className="text-gray-700 dark:text-gray-300">Transaction ID</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Sender</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Recipient</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Currency</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx) => {
                      const StatusIcon = getStatusIcon(tx.status);
                      return (
                        <TableRow
                          key={tx.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors border-b border-gray-100 dark:border-gray-800"
                          onClick={() => setSelectedTransaction(tx.id)}
                        >
                          <TableCell className="font-mono text-xs text-gray-900 dark:text-gray-100">
                            <div className="flex items-center gap-2">
                              <Send className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              {tx.fabric_hash.substring(0, 16)}...
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {format(new Date(tx.created_at), 'MMM dd, HH:mm:ss')}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {tx.sender_id}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                            {tx.recipient_id}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 dark:text-white">
                            {Number(tx.amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{tx.source_currency}</span>
                              <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                              <span className="font-medium">{tx.target_currency}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(tx.status)} className="flex items-center gap-1 w-fit">
                              <StatusIcon className="h-3 w-3" />
                              {formatStatus(tx.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDetailDrawer
        transactionId={selectedTransaction}
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
