// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
// import { format } from 'date-fns';

// interface TransactionDetailDrawerProps {
//   transactionId: string | null;
//   open: boolean;
//   onClose: () => void;
// }

// export function TransactionDetailDrawer({
//   transactionId,
//   open,
//   onClose,
// }: TransactionDetailDrawerProps) {
//   const { data: transaction, isLoading } = useQuery({
//     queryKey: ['transaction-detail', transactionId],
//     queryFn: async () => {
//       if (!transactionId) return null;

//       const { data, error } = await supabase
//         .from('transactions')
//         .select('*')
//         .eq('id', transactionId)
//         .maybeSingle();

//       if (error) throw error;
//       return data;
//     },
//     enabled: !!transactionId,
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'settled':
//         return 'success';
//       case 'pending':
//         return 'secondary';
//       case 'bridge_locked':
//         return 'outline';
//       case 'fx_swapping':
//         return 'outline';
//       case 'failed':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

//   const { data: bridgeErrors } = useQuery({
//     queryKey: ['bridge-errors', transactionId],
//     queryFn: async () => {
//       if (!transactionId) return [];

//       const { data, error } = await supabase
//         .from('bridge_errors')
//         .select('*')
//         .eq('transaction_id', transactionId);

//       if (error) throw error;
//       return data;
//     },
//     enabled: !!transactionId,
//   });

//   if (!transaction) {
//     return null;
//   }

//   const steps = [
//     {
//       label: 'Fabric Submission',
//       timestamp: transaction.submitted_at,
//       completed: !!transaction.submitted_at,
//       icon: CheckCircle2,
//     },
//     {
//       label: 'Bridge Lock',
//       timestamp: transaction.bridge_locked_at,
//       completed: !!transaction.bridge_locked_at,
//       icon: transaction.bridge_locked_at ? CheckCircle2 : Clock,
//     },
//     {
//       label: 'Stellar FX Swap',
//       timestamp: transaction.fx_swapped_at,
//       completed: !!transaction.fx_swapped_at,
//       icon: transaction.fx_swapped_at ? CheckCircle2 : Clock,
//     },
//     {
//       label: 'Final Settlement',
//       timestamp: transaction.settled_at,
//       completed: !!transaction.settled_at,
//       icon: transaction.settled_at ? CheckCircle2 : Clock,
//     },
//   ];

//   return (
//     <Sheet open={open} onOpenChange={onClose}>
//       <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto bg-white dark:bg-gray-900">
//         <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
//           <SheetTitle className="text-gray-900 dark:text-white">Transaction Details</SheetTitle>
//         </SheetHeader>

//         {isLoading ? (
//           <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
//         ) : (
//           <div className="mt-6 space-y-6">
//             <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//               <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Status:</span>
//                   <Badge variant={getStatusColor(transaction.status) as any}>
//                     {transaction.status.split('_').map((word: string) =>
//                       word.charAt(0).toUpperCase() + word.slice(1)
//                     ).join(' ')}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Amount:</span>
//                   <span className="font-semibold text-gray-900 dark:text-white">
//                     {Number(transaction.amount).toFixed(2)} {transaction.source_currency}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Conversion:</span>
//                   <span className="text-gray-900 dark:text-white flex items-center gap-1">
//                     <span className="font-medium">{transaction.source_currency}</span>
//                     <ArrowRight className="h-3 w-3 text-gray-400" />
//                     <span className="font-medium">{transaction.target_currency}</span>
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <Separator className="dark:bg-gray-700" />

//             <div>
//               <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Transaction Hashes</h3>
//               <div className="space-y-3 text-sm">
//                 <div>
//                   <div className="text-gray-600 dark:text-gray-400 mb-2 font-medium">Fabric Hash:</div>
//                   <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg break-all border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
//                     {transaction.fabric_hash}
//                   </div>
//                 </div>
//                 {transaction.stellar_hash && (
//                   <div>
//                     <div className="text-gray-600 dark:text-gray-400 mb-2 font-medium">Stellar Hash:</div>
//                     <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg break-all border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
//                       {transaction.stellar_hash}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Separator className="dark:bg-gray-700" />

//             <div>
//               <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Participants</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Sender:</span>
//                   <span className="font-medium text-gray-900 dark:text-white">{transaction.sender_id}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-400">Recipient:</span>
//                   <span className="font-medium text-gray-900 dark:text-white">{transaction.recipient_id}</span>
//                 </div>
//               </div>
//             </div>

//             <Separator className="dark:bg-gray-700" />

//             <div>
//               <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Cross-Chain Trace Timeline</h3>
//               <div className="space-y-4">
//                 {steps.map((step, index) => {
//                   const Icon = step.icon;
//                   const isLast = index === steps.length - 1;

//                   return (
//                     <div key={step.label} className="flex gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className={`rounded-full p-2 shadow-sm ${
//                           step.completed
//                             ? 'bg-green-100 dark:bg-green-900/30'
//                             : 'bg-gray-100 dark:bg-gray-800'
//                         }`}>
//                           <Icon className={`h-5 w-5 ${
//                             step.completed
//                               ? 'text-green-600 dark:text-green-400'
//                               : 'text-gray-400 dark:text-gray-500'
//                           }`} />
//                         </div>
//                         {!isLast && (
//                           <div className={`w-0.5 h-12 ${
//                             step.completed
//                               ? 'bg-green-200 dark:bg-green-900/50'
//                               : 'bg-gray-200 dark:bg-gray-700'
//                           }`} />
//                         )}
//                       </div>
//                       <div className="flex-1 pb-8">
//                         <div className="font-medium text-gray-900 dark:text-white">{step.label}</div>
//                         {step.timestamp ? (
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                             {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm:ss')}
//                           </div>
//                         ) : (
//                           <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pending...</div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {transaction.error_message && (
//               <>
//                 <Separator className="dark:bg-gray-700" />
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
//                     <h3 className="font-semibold text-red-600 dark:text-red-500">Error Details</h3>
//                   </div>
//                   <div className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-300">
//                     {transaction.error_message}
//                   </div>
//                 </div>
//               </>
//             )}

//             {bridgeErrors && bridgeErrors.length > 0 && (
//               <>
//                 <Separator className="dark:bg-gray-700" />
//                 <div>
//                   <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Bridge Errors</h3>
//                   <div className="space-y-2">
//                     {bridgeErrors.map((error) => (
//                       <div key={error.id} className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
//                         <div className="font-medium text-red-900 dark:text-red-300">{error.error_type}</div>
//                         <div className="text-red-700 dark:text-red-400 mt-1">{error.error_message}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }


// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   ArrowRight,
// } from 'lucide-react';
// import { format } from 'date-fns';

// const BASE_URL =
//   'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

// interface Transaction {
//   id: string;
//   from: string;
//   to: string;
//   amount: number;
//   currency: string;
//   convertedAmount: number;
//   convertedCurrency: string;
//   fxRate: number;
//   fxRateLocked: boolean;
//   status: string;
//   timestamp: string;
//   error_message?: string;
// }

// interface BridgeError {
//   id: string;
//   error_type: string;
//   error_message: string;
// }

// interface TransactionDetailDrawerProps {
//   transactionId: string | null;
//   open: boolean;
//   onClose: () => void;
// }

// export function TransactionDetailDrawer({
//   transactionId,
//   open,
//   onClose,
// }: TransactionDetailDrawerProps) {
//   /* ---------- Transaction ---------- */
//   const {
//     data: transaction,
//     isLoading,
//     isError,
//   } = useQuery<Transaction>({
//     queryKey: ['transaction-detail', transactionId],
//     enabled: !!transactionId,
//     queryFn: async () => {
//       const res = await fetch(
//         `${BASE_URL}/transactions/${transactionId}`
//       );
//       if (!res.ok) {
//         throw new Error('Transaction not found');
//       }
//       return res.json();
//     },
//   });

//   /* ---------- Bridge Errors ---------- */
//   const { data: bridgeErrors } = useQuery<BridgeError[]>({
//     queryKey: ['bridge-errors', transactionId],
//     enabled: !!transactionId,
//     queryFn: async () => {
//       const res = await fetch(
//         `${BASE_URL}/bridge-errors?transaction_id=${transactionId}`
//       );
//       if (!res.ok) return [];
//       return res.json();
//     },
//   });

//   /* ---------- Timeline ---------- */
//   const steps = transaction
//     ? [
//         {
//           label: 'Transaction Initiated',
//           completed: true,
//           timestamp: transaction.timestamp,
//         },
//         {
//           label: 'FX Rate Locked',
//           completed: transaction.fxRateLocked,
//           timestamp: transaction.fxRateLocked
//             ? transaction.timestamp
//             : null,
//         },
//         {
//           label: 'Amount Conversion',
//           completed: transaction.status === 'completed',
//           timestamp:
//             transaction.status === 'completed'
//               ? transaction.timestamp
//               : null,
//         },
//         {
//           label: 'Final Settlement',
//           completed: transaction.status === 'completed',
//           timestamp:
//             transaction.status === 'completed'
//               ? transaction.timestamp
//               : null,
//         },
//       ]
//     : [];

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={(isOpen) => {
//         if (!isOpen) onClose();
//       }}
//     >
//       <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto bg-white dark:bg-gray-900">
//         <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
//           <SheetTitle>Transaction Details</SheetTitle>
//         </SheetHeader>

//         {/* ---------- Loading ---------- */}
//         {isLoading && (
//           <div className="py-10 text-center text-gray-500">
//             Loading transaction…
//           </div>
//         )}

//         {/* ---------- Error ---------- */}
//         {isError && (
//           <div className="py-10 text-center text-red-600">
//             Failed to load transaction
//           </div>
//         )}

//         {/* ---------- Content ---------- */}
//         {transaction && (
//           <div className="mt-6 space-y-6">
//             {/* Basic Info */}
//             <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
//               <h3 className="font-semibold mb-3">Basic Information</h3>

//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span>Status</span>
//                   <Badge>
//                     {transaction.status
//                       .split('_')
//                       .map(
//                         (w) => w[0].toUpperCase() + w.slice(1)
//                       )
//                       .join(' ')}
//                   </Badge>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Amount</span>
//                   <span className="font-semibold">
//                     {transaction.amount.toFixed(2)}{' '}
//                     {transaction.currency}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Converted</span>
//                   <span className="font-semibold">
//                     {transaction.convertedAmount.toFixed(2)}{' '}
//                     {transaction.convertedCurrency}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Conversion</span>
//                   <span className="flex items-center gap-1">
//                     {transaction.currency}
//                     <ArrowRight className="h-3 w-3" />
//                     {transaction.convertedCurrency}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* FX Info */}
//             <div>
//               <h3 className="font-semibold mb-3">
//                 Exchange Information
//               </h3>

//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span>FX Rate</span>
//                   <span className="font-mono">
//                     {transaction.fxRate.toFixed(4)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Rate Locked</span>
//                   <Badge
//                     variant={
//                       transaction.fxRateLocked
//                         ? 'default'
//                         : 'secondary'
//                     }
//                   >
//                     {transaction.fxRateLocked
//                       ? '🔒 Locked'
//                       : 'Floating'}
//                   </Badge>
//                 </div>

//                 <div>
//                   <div className="mb-1 text-gray-500">
//                     Transaction ID
//                   </div>
//                   <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
//                     {transaction.id}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Participants */}
//             <div>
//               <h3 className="font-semibold mb-3">
//                 Participants
//               </h3>

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Sender</span>
//                   <span className="font-medium">
//                     {transaction.from}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Recipient</span>
//                   <span className="font-medium">
//                     {transaction.to}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Timeline */}
//             <div>
//               <h3 className="font-semibold mb-4">
//                 Cross-Chain Trace Timeline
//               </h3>

//               <div className="space-y-4">
//                 {steps.map((step, idx) => {
//                   const Icon = step.completed
//                     ? CheckCircle2
//                     : Clock;

//                   return (
//                     <div key={idx} className="flex gap-4">
//                       <Icon
//                         className={`h-5 w-5 ${
//                           step.completed
//                             ? 'text-green-600'
//                             : 'text-amber-600'
//                         }`}
//                       />
//                       <div>
//                         <div className="font-medium">
//                           {step.label}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {step.timestamp
//                             ? format(
//                                 new Date(step.timestamp),
//                                 'MMM dd, yyyy HH:mm:ss'
//                               )
//                             : 'Pending…'}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Error Message */}
//             {transaction.error_message && (
//               <>
//                 <Separator />
//                 <div>
//                   <div className="flex items-center gap-2 mb-2 text-red-600">
//                     <AlertCircle className="h-5 w-5" />
//                     <h3 className="font-semibold">
//                       Error Details
//                     </h3>
//                   </div>
//                   <div className="bg-red-50 p-3 rounded text-sm">
//                     {transaction.error_message}
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Bridge Errors */}
//             {bridgeErrors && bridgeErrors.length > 0 && (
//               <>
//                 <Separator />
//                 <div>
//                   <h3 className="font-semibold mb-3">
//                     Bridge Errors
//                   </h3>
//                   <div className="space-y-2">
//                     {bridgeErrors.map((err) => (
//                       <div
//                         key={err.id}
//                         className="bg-red-50 p-3 rounded text-sm"
//                       >
//                         <div className="font-medium">
//                           {err.error_type}
//                         </div>
//                         <div className="text-red-700">
//                           {err.error_message}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }
'use client';

import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
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

//   New transaction interface for updated format
interface Transaction {
  id: string;
  type: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  convertedCurrency: string;
  fxRate: number;
  fxRateLocked: boolean;
  status: string;
  timestamp: string;
  error_message?: string;
}

interface TransactionDetailDrawerProps {
  transactionId: string | null;
  open: boolean;
  onClose: () => void;
}

interface BridgeError {
  id: string;
  transaction_id: string;
  error_type: string;
  error_message: string;
  error_data: Record<string, any>;
  resolved: boolean;
  created_at: string;
}

const baseURL = 'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

// MANJEET: Mock transaction data for testing drawer binding
const mockTransaction: Transaction = [
  {
    "id": "d7a598f503013126f0e93201a42f8574624542b701517b5467a1f3baaf0d3752",
    "from": "CUST_KW_001",
    "to": "CUST_BH_001",
    "amount": 100,
    "currency": "KWD",
    "convertedAmount": 102,
    "convertedCurrency": "BHD",
    "fxRate": 1.02,
    "fxRateLocked": false,
    "timestamp": "2026-01-22T05:20:59Z",
    "status": "completed",
    "type": "customer"
  }
][0];

// const mockBridgeErrors = [
//     {
//         "id": "a7428eea-fb65-420a-b956-e8b3dceb40ba",
//         "transaction_id": "0ad60303-0c35-4f3b-ba04-e86240d864a1",
//         "error_type": "stellar_payment_failed",
//         "error_message": "Path payment failed: no path found for EUR to AUD conversion with sufficient liquidity",
//         "error_data": {
//             "amount": 150000,
//             "source_asset": "EUR",
//             "attempted_paths": 3,
//             "destination_asset": "AUD"
//         },
//         "resolved": false,
//         "created_at": "2026-01-05T11:10:10.501616+00:00"
//     }
// ]

// const mocktransactionStatusErrors = [
//     {
//         "error_message": "Stellar path payment failed: insufficient liquidity for requested conversion",
//     }
// ];

export function TransactionDetailDrawer({
  transactionId,
  open,
  onClose,
}: TransactionDetailDrawerProps) {
  //   Fetch transaction from HTTP API endpoint
  const { data: transaction, isLoading, error } = useQuery({
    queryKey: ['transaction-detail', transactionId],
    queryFn: async () => {
      if (!transactionId) return null;

      try {
        const url = `${baseURL}/transactions/${transactionId}`;
        console.log('Fetching transaction from:', url);
        
        const response = await fetch(url);
        console.log('Transaction API response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch transaction');
        const data = await response.json();
        console.log('Fetched transaction data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching transaction:', error);
        // MANJEET: Fall back to mock data for drawer verification
        console.warn('Using mock transaction data for testing');
        return mockTransaction;
      }
    },
    enabled: !!transactionId,
  });

  const { data: bridgeErrors } = useQuery({
    queryKey: ['bridge-errors', transactionId],
    queryFn: async () => {
      if (!transactionId) return [];

      try {
        const params = new URLSearchParams();
        params.append('select', '*');
        const url = `${baseURL}/bridge-errors?${params.toString()}transaction_id=${transactionId}`;
        console.log('Fetching bridge errors from:', url);
        
        const response = await fetch(url);
        console.log('Bridge Errors API response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch bridge errors');
        const data = await response.json();
        console.log('Fetched bridge errors data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching bridge errors:', error);
        // MANJEET: Fall back to mock bridge errors for drawer verification
        console.warn('Using mock bridge errors data for testing');
        // return mockBridgeErrors;
      }
    },
    enabled: !!transactionId,
  });

  /* REMOVED: Old Supabase query
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
  */

  if (!transaction) {
    return null;
  }

  //   Updated steps based on new transaction format
  const steps = [
    {
      label: 'Transaction Initiated',
      timestamp: transaction.timestamp,
      completed: true,
      icon: CheckCircle2,
    },
    {
      label: 'FX Rate Locked',
      timestamp: transaction.fxRateLocked ? transaction.timestamp : null,
      completed: transaction.fxRateLocked,
      icon: transaction.fxRateLocked ? CheckCircle2 : Clock,
    },
    {
      label: 'Amount Conversion',
      timestamp: transaction.status === 'completed' ? transaction.timestamp : null,
      completed: transaction.status === 'completed',
      icon: transaction.status === 'completed' ? CheckCircle2 : Clock,
    },
    {
      label: 'Final Settlement',
      timestamp: transaction.status === 'completed' ? transaction.timestamp : null,
      completed: transaction.status === 'completed',
      icon: transaction.status === 'completed' ? CheckCircle2 : Clock,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">

        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="mt-6 space-y-6">
            {/*   Basic Information section with new fields */}
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge>
                    {transaction.status.split('_').map((word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{transaction.type}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {Number(transaction.amount).toFixed(2)} {transaction.currency}
                  </span>
                </div>
                {/*   Converted amount field */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Converted Amount:</span>
                  <span className="font-semibold">
                    {Number(transaction.convertedAmount).toFixed(2)} {transaction.convertedCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion:</span>
                  <span>{transaction.currency} → {transaction.convertedCurrency}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/*   Exchange Information section replacing Transaction Hashes */}
            <div>
              <h3 className="font-semibold mb-3">Exchange Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">FX Rate:</span>
                  <span className="font-mono">{transaction.fxRate.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate Locked:</span>
                  <Badge variant={transaction.fxRateLocked ? 'default' : 'secondary'}>
                    {transaction.fxRateLocked ? '🔒 Locked' : 'Floating'}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Transaction ID:</div>
                  <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded break-all">

                    {transaction.id}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/*   Participants section with new from/to fields */}
            <div>
              <h3 className="font-semibold mb-3">Participants</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sender:</span>
                  <span className="font-medium">{transaction.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium">{transaction.to}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* ...existing code... */}
            {/* <div>
              <h3 className="font-semibold mb-4">Cross-Chain Trace Timeline</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-2 ${
                          step.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            step.completed ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-12 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="font-medium">{step.label}</div>
                        {step.timestamp ? (
                          <div className="text-xs text-gray-500 mt-1">
                            {format(new Date(step.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 mt-1">Pending...</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}

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
                            : 'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            step.completed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-12 ${
                            step.completed
                              ? 'bg-green-200 dark:bg-green-900/50'
                              : 'bg-amber-200 dark:bg-amber-900/50'
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

            {/* {/*   Error section (kept commented for potential future use) */}
            {transaction.error_message && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-600">Error Details</h3>
                  </div>
                  <div className="text-sm bg-red-50 p-3 rounded border border-red-200">
                    {transaction.error_message}
                  </div>
                </div>
              </>
            )}

            {bridgeErrors && bridgeErrors.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Bridge Errors</h3>
                  <div className="space-y-2">
                    {bridgeErrors.map((error: BridgeError) => (
                      <div key={error.id} className="text-sm bg-red-50 p-3 rounded border border-red-200">
                        <div className="font-medium text-red-900">{error.error_type}</div>
                        <div className="text-red-700 mt-1">{error.error_message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {/* */} 
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
