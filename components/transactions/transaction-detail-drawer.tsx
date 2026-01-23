'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionDetailDrawerProps {
  transactionId: string | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailDrawer({
  transactionId,
  open,
  onClose,
}: TransactionDetailDrawerProps) {
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction-detail', transactionId],
    queryFn: async () => {
      if (!transactionId) return null;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!transactionId,
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

  const { data: bridgeErrors } = useQuery({
    queryKey: ['bridge-errors', transactionId],
    queryFn: async () => {
      if (!transactionId) return [];

      const { data, error } = await supabase
        .from('bridge_errors')
        .select('*')
        .eq('transaction_id', transactionId);

      if (error) throw error;
      return data;
    },
    enabled: !!transactionId,
  });

  if (!transaction) {
    return null;
  }

  const steps = [
    {
      label: 'Fabric Submission',
      timestamp: transaction.submitted_at,
      completed: !!transaction.submitted_at,
      icon: CheckCircle2,
    },
    {
      label: 'Bridge Lock',
      timestamp: transaction.bridge_locked_at,
      completed: !!transaction.bridge_locked_at,
      icon: transaction.bridge_locked_at ? CheckCircle2 : Clock,
    },
    {
      label: 'Stellar FX Swap',
      timestamp: transaction.fx_swapped_at,
      completed: !!transaction.fx_swapped_at,
      icon: transaction.fx_swapped_at ? CheckCircle2 : Clock,
    },
    {
      label: 'Final Settlement',
      timestamp: transaction.settled_at,
      completed: !!transaction.settled_at,
      icon: transaction.settled_at ? CheckCircle2 : Clock,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto bg-white dark:bg-gray-900">
        <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <SheetTitle className="text-gray-900 dark:text-white">Transaction Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant={getStatusColor(transaction.status) as any}>
                    {transaction.status.split('_').map((word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Number(transaction.amount).toFixed(2)} {transaction.source_currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Conversion:</span>
                  <span className="text-gray-900 dark:text-white flex items-center gap-1">
                    <span className="font-medium">{transaction.source_currency}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <span className="font-medium">{transaction.target_currency}</span>
                  </span>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Transaction Hashes</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2 font-medium">Fabric Hash:</div>
                  <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg break-all border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    {transaction.fabric_hash}
                  </div>
                </div>
                {transaction.stellar_hash && (
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 mb-2 font-medium">Stellar Hash:</div>
                    <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg break-all border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      {transaction.stellar_hash}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Participants</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sender:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{transaction.sender_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Recipient:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{transaction.recipient_id}</span>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Cross-Chain Trace Timeline</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-2 shadow-sm ${
                          step.completed
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            step.completed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-12 ${
                            step.completed
                              ? 'bg-green-200 dark:bg-green-900/50'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="font-medium text-gray-900 dark:text-white">{step.label}</div>
                        {step.timestamp ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pending...</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {transaction.error_message && (
              <>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                    <h3 className="font-semibold text-red-600 dark:text-red-500">Error Details</h3>
                  </div>
                  <div className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-300">
                    {transaction.error_message}
                  </div>
                </div>
              </>
            )}

            {bridgeErrors && bridgeErrors.length > 0 && (
              <>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Bridge Errors</h3>
                  <div className="space-y-2">
                    {bridgeErrors.map((error) => (
                      <div key={error.id} className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                        <div className="font-medium text-red-900 dark:text-red-300">{error.error_type}</div>
                        <div className="text-red-700 dark:text-red-400 mt-1">{error.error_message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
