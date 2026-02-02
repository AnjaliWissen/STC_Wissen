'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock ,Copy, Check} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { useState } from 'react';



const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};


/* -------------------- Types -------------------- */

interface TimelineStage {
  stage: string;
  title: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp?: string;
  details: Record<string, any>;
}

interface TimelineResponse {
  success: boolean;
  timeline: {
    transactionId: string;
    stctx_ext_id: string
    type: string;
    status: string;
    progressPercentage: number;
    duration: string;
    stages: TimelineStage[];
    metadata?: {
      from: string;
      to: string;
      amount: number;
      currency: string;
      originalAmount: number;
      originalCurrency: string;
    };
  };
}

interface TransactionDetailDrawerProps {
  transactionId: string | null;
  open: boolean;
  onClose: () => void;
}

const BASE_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

/* -------------------- Component -------------------- */

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
        {value}
      </div>

      <button
        onClick={handleCopy}
        className="mt-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500" />
        )}
      </button>
    </div>
  );
}




export function TransactionDetailDrawer({
  transactionId,
  open,
  onClose,
}: TransactionDetailDrawerProps) {
  const { data, isLoading, isError } = useQuery<TimelineResponse>({
    queryKey: ['transaction-timeline', transactionId],
    enabled: !!transactionId,
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/transaction/${transactionId}/timeline`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch transaction timeline');
      }
      return res.json();
    },
  });

  const timeline = data?.timeline;
  const metadata = timeline?.metadata;
 const statusVariant = getStatusColor(timeline?.status ?? 'pending');

  const fxStage = timeline?.stages.find(
    (s) => s.stage === 'fx_rate_lock'
  );
  const conversionStage = timeline?.stages.find(
    (s) => s.stage === 'conversion'
  );
  

  return (
    
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto bg-white dark:bg-gray-900 border-l">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>

        {/* ---------- Loading ---------- */}
        {isLoading && (
          <div className="py-8 text-center text-gray-500">
            Loading transaction…
          </div>
        )}

        {/* ---------- Error ---------- */}
        {isError && (
          <div className="py-8 text-center text-red-600">
            Failed to load transaction
          </div>
        )}

        {/* ---------- Content ---------- */}
        {timeline && (
          <div className="mt-6 space-y-6">
            {/* ---------- Basic Info ---------- */}
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status</span>
                  {/* <Badge>{timeline.status}</Badge>/ */}
                  <Badge
  variant={statusVariant === 'success' ? 'default' : statusVariant}
  className={cn(
    'capitalize',
    statusVariant === 'success' &&
      'bg-green-600 text-white hover:bg-green-600'
  )}
>
  {timeline.status}
</Badge>

                </div>

                <div className="flex justify-between">
                  <span>Sender</span>
                  <span className="font-medium">{metadata?.from}</span>
                </div>

                <div className="flex justify-between">
                  <span>Recipient</span>
                  <span className="font-medium">{metadata?.to}</span>
                </div>

                <div className="flex justify-between">
                  <span>Original Amount</span>
                  <span>
                    {metadata?.originalAmount}{' '}
                    {metadata?.originalCurrency}
                  </span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Final Amount</span>
                  <span>
                    {metadata?.amount} {metadata?.currency}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* ---------- Exchange Info ---------- */}
            <div>
              <h3 className="font-semibold mb-3">
                Exchange Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>FX Rate</span>
                  <span className="font-mono">
                    {conversionStage?.details?.fxRate ?? '-'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Rate Locked</span>
                  <Badge
                    variant={
                      fxStage?.details?.locked
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {fxStage?.details?.locked
                      ? '🔒 Locked'
                      : 'Floating'}
                  </Badge>
                </div>

                <div>
                  <div className="text-gray-600 mb-1">
                    STC Transaction ID
                  </div>
                  {/* <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                    {timeline.transactionId}
                  </div> */}
                  <CopyableValue value={timeline.transactionId} />
                </div>
                <div>
                  <div className="text-gray-600 mb-1">
                    Blockchain Hash
                  </div>
                  {/* <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                    {timeline.stctx_ext_id}
                  </div> */}
                  <CopyableValue value={timeline.stctx_ext_id} />

                </div>
              </div>
            </div>

            <Separator />

            {/* ---------- Timeline ---------- */}
            {/* ---------- Timeline ---------- */}
<div>
  <h3 className="font-semibold mb-5">
    Cross-Chain Trace Timeline
  </h3>

  <div className="space-y-6">
    {timeline.stages.map((step, index) => {
      const completed = step.status === 'completed';
      const Icon = completed ? CheckCircle2 : Clock;
      const isLast = index === timeline.stages.length - 1;
      const badgeVariant = getStatusColor(step.status);

      return (
        <div key={step.stage} className="flex gap-4">
          {/* Left rail */}
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full p-2 shadow-sm ${
                completed
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  completed
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              />
            </div>

            {!isLast && (
              <div
                className={`w-0.5 flex-1 mt-1 ${
                  completed
                    ? 'bg-green-300 dark:bg-green-800'
                    : 'bg-amber-300 dark:bg-amber-800'
                }`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {step.title}
              </div>
              {/* <Badge
                variant={completed ? 'default' : 'secondary'}
                className="text-xs"
              >
                {step.status}
              </Badge> */}
              <Badge
              variant={
                badgeVariant === 'success' ? 'default' : badgeVariant
              }
              className={cn(
                'text-xs capitalize',
                badgeVariant === 'success' &&
                  'bg-green-600 text-white hover:bg-green-600'
              )}
            >
              {step.status}
            </Badge>

            </div>

            <div className="text-xs text-gray-500 mt-1">
              {step.timestamp
                ? format(
                    new Date(step.timestamp),
                    'MMM dd, yyyy HH:mm:ss'
                  )
                : 'Pending…'}
            </div>

            {step.details?.description && (
              <div className="text-xs text-gray-400 mt-2 leading-relaxed">
                {step.details.description}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
