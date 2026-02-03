// 'use client';

// import { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import {
//   Search,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   ArrowRightLeft,
//   Send,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer';

// const BASE_URL =
//   'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

// interface Transaction {
//   id: string;
//   stctx_ext_id: string;
//   from: string;
//   to: string;
//   amount: number;
//   currency: string;
//   fxRate: number;
//   fxRateLocked: boolean;
//   status: string;
//   timestamp: string;
// }

// export default function TransactionsPage() {
//   const [inputValue, setInputValue] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTransactionId, setSelectedTransactionId] =
//     useState<string | null>(null);

//   /* ---------- Debounce ---------- */
//   useEffect(() => {
//     const t = setTimeout(() => setSearchTerm(inputValue.trim()), 400);
//     return () => clearTimeout(t);
//   }, [inputValue]);

//   /* ---------- Fetch ---------- */
//   const { data, isLoading, isError } = useQuery<Transaction[]>({
//     queryKey: ['transactions'],
//     queryFn: async () => {
//       const res = await fetch(`${BASE_URL}/transactions`);
//       if (!res.ok) throw new Error('Failed');
//       return res.json();
//     },
//   });

//   /* ---------- Filter ---------- */
//   const transactions =
//     data?.filter((tx) => {
//       if (!searchTerm) return true;
//       const q = searchTerm.toLowerCase();
//       return (
//         tx.id.toLowerCase().includes(q) ||
//         tx.stctx_ext_id.toLowerCase().includes(q) ||
//         tx.from.toLowerCase().includes(q) ||
//         tx.to.toLowerCase().includes(q) ||
//         tx.currency.toLowerCase().includes(q) ||
//         tx.status.toLowerCase().includes(q)
//       );
//     }) ?? [];

//   /* ---------- Status UI ---------- */
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'success';
//       case 'pending':
//         return 'secondary';
//       case 'processing':
//         return 'outline';
//       case 'failed':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return CheckCircle2;
//       case 'pending':
//         return Clock;
//       case 'processing':
//         return ArrowRightLeft;
//       case 'failed':
//         return XCircle;
//       default:
//         return Clock;
//     }
//   };

//   const formatStatus = (status: string) =>
//     status
//       .split('_')
//       .map((w) => w[0].toUpperCase() + w.slice(1))
//       .join(' ');

//   return (
//     <div className="p-6 space-y-6">
//       {/* ---------- Header ---------- */}
//       <div>
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Transaction Observability
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">
//           End-to-end tracking of cross-border payment flows
//         </p>
//       </div>

//       {/* ---------- Card ---------- */}
//       <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//         <CardHeader className="border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-gray-900 dark:text-white">
//               Transaction Ledger
//             </CardTitle>

//             <div className="relative w-96">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
//               <Input
//                 placeholder="Search by ID, user, currency, status..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//               />
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           {isLoading && (
//             <div className="py-8 text-center text-gray-500 dark:text-gray-400">
//               Loading transactions…
//             </div>
//           )}

//           {isError && (
//             <div className="py-8 text-center text-red-600">
//               Failed to load transactions
//             </div>
//           )}

//           {!isLoading && !isError && (
//             <div className="rounded-b-lg overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Transaction ID
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Timestamp
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Sender
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Recipient
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Amount
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       FX
//                     </TableHead>
//                     <TableHead className="text-gray-700 dark:text-gray-300">
//                       Status
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {transactions.length > 0 ? (
//                     transactions.map((tx) => {
//                       const StatusIcon = getStatusIcon(tx.status);

//                       return (
//                         <TableRow
//                           key={tx.stctx_ext_id}
//                           className="cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80"
//                           onClick={() =>
//                             setSelectedTransactionId(tx.id)
//                           }
//                         >
//                           <TableCell className="font-mono text-xs text-gray-900 dark:text-gray-100">
//                             <Send className="inline h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
//                             {tx.id.slice(0, 16)}…
//                           </TableCell>

//                           <TableCell className="text-sm text-gray-700 dark:text-gray-300">
//                             {format(
//                               new Date(tx.timestamp),
//                               'MMM dd, HH:mm:ss'
//                             )}
//                           </TableCell>

//                           <TableCell className="text-sm text-gray-700 dark:text-gray-300">
//                             {tx.from}
//                           </TableCell>

//                           <TableCell className="text-sm text-gray-700 dark:text-gray-300">
//                             {tx.to}
//                           </TableCell>

//                           <TableCell className="font-semibold text-gray-900 dark:text-white">
//                             {tx.amount.toFixed(2)} {tx.currency}
//                           </TableCell>

//                           <TableCell className="text-sm text-gray-700 dark:text-gray-300">
//                             {tx.fxRate.toFixed(4)}
//                             {tx.fxRateLocked && (
//                               <span className="ml-1 text-green-600">🔒</span>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             <Badge
//                               variant={getStatusColor(tx.status)}
//                               className="flex items-center gap-1 w-fit"
//                             >
//                               <StatusIcon className="h-3 w-3" />
//                               {formatStatus(tx.status)}
//                             </Badge>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="text-center py-8 text-gray-500 dark:text-gray-400"
//                       >
//                         {searchTerm
//                           ? 'No transactions match your search'
//                           : 'No transactions found'}
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ---------- Drawer ---------- */}
//       <TransactionDetailDrawer
//         transactionId={selectedTransactionId}
//         open={!!selectedTransactionId}
//         onClose={() => setSelectedTransactionId(null)}
//       />
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRightLeft,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { TransactionDetailDrawer } from '@/components/transactions/transaction-detail-drawer';

const BASE_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

/* ---------- Types ---------- */

interface BridgeTx {
  transactionId: string;
  stellarTxHash: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
}

interface BridgeTxResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  transactions: BridgeTx[];
}
interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  fxRate: number;
  fxRateLocked: boolean;
  status: string;
  timestamp: string;
  convertedAmount: number;       
  convertedCurrency: string;   
  stctx_ext_id:string;  
}

interface TransactionsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  transactions: Transaction[];
}

export default function TransactionsPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] =
    useState<string | null>(null);

  /* ---------- Pagination ---------- */
  const [page, setPage] = useState(1);
  const limit = 10;

  /* ---------- Debounce Search ---------- */
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(inputValue.trim()), 400);
    return () => clearTimeout(t);
  }, [inputValue]);

  /* ---------- Fetch (Paginated) ---------- */
  // const { data, isLoading, isError } = useQuery<TransactionsResponse>({
  //   queryKey: ['transactions', page, limit],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `${BASE_URL}/transactions?page=${page}&limit=${limit}`
  //     );
  //     if (!res.ok) throw new Error('Failed to fetch transactions');
  //     return res.json();
  //   },
  //   // keepPreviousData: true,
  //   placeholderData: (previousData) => previousData,
  // });

  const { data, isLoading, isError } = useQuery<TransactionsResponse>({
  queryKey: ['transactions', page, limit, searchTerm],
  queryFn: async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    // 🔐 optional only — does NOT affect other API usage
    if (searchTerm) {
      params.append('search', searchTerm);
    }

    const res = await fetch(
      `${BASE_URL}/transactions?${params.toString()}`
    );

    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  placeholderData: (prev) => prev,
});


  /* ---------- Filter (Client-side, current page) ---------- */
  // const transactions =
  //   data?.transactions.filter((tx) => {
  //     if (!searchTerm) return true;
  //     const q = searchTerm.toLowerCase();
  //     return (
  //       tx.id.toLowerCase().includes(q) ||
  //       tx.from.toLowerCase().includes(q) ||
  //       tx.to.toLowerCase().includes(q) ||
  //       tx.currency.toLowerCase().includes(q) ||
  //       tx.status.toLowerCase().includes(q)
  //     );
  //   }) ?? [];

  const transactions = (data?.transactions ?? []) as Transaction[];


  /* ---------- Status UI ---------- */
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'processing':
        return ArrowRightLeft;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatStatus = (status: string) =>
    status
      .split('_')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <div className="p-6 space-y-6">
      {/* ---------- Header ---------- */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transaction Observability
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          End-to-end tracking of cross-border payment flows
        </p>
      </div>

      {/* ---------- Card ---------- */}
      <Card className='rounded-lg border bg-card shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50'>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Ledger</CardTitle>

            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, user, currency, status..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading && (
            <div className="py-8 text-center text-gray-500">
              Loading transactions…
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-red-600">
              Failed to load transactions
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>FX</TableHead>
                    <TableHead>Converted Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((tx) => {
                      const StatusIcon = getStatusIcon(tx.status);

                      return (
                        <TableRow
                          key={tx.stctx_ext_id}
                          className="cursor-pointer transition-colors hover:bg-gray-200/20 dark:hover:bg-gray-700/40"
                          onClick={() => setSelectedTransactionId(tx.id)}
                        >
                          <TableCell className="font-mono text-xs">
                            <Send className="inline h-4 w-4 mr-1 text-blue-500" />
                            {tx.stctx_ext_id.slice(0, 16)}…
                          </TableCell>

                          <TableCell>
                            {format(
                              new Date(tx.timestamp),
                              'MMM dd, HH:mm:ss'
                            )}
                          </TableCell>

                          <TableCell>{tx.from}</TableCell>
                          <TableCell>{tx.to}</TableCell>

                          <TableCell className="font-semibold">
                            {tx.amount.toFixed(2)} {tx.currency}
                          </TableCell>

                          <TableCell>
                            {tx.fxRate}
                            {tx.fxRateLocked && (
                              <span className="font-semibold text-emerald-600">🔒</span>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-600">
                          {tx.convertedAmount != null && tx.convertedCurrency
                            ? `${tx.convertedAmount.toFixed(2)} ${tx.convertedCurrency}`
                            : '—'}
                        </TableCell>

                        
                       
                        

                          <TableCell>
                            <Badge
                              variant={getStatusColor(tx.status)}
                              className="flex items-center gap-1 w-fit"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {formatStatus(tx.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* ---------- Pagination ---------- */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-gray-600">
                  Page {data?.page} of {data?.totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data?.hasPrevPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data?.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------- Drawer ---------- */}
      <TransactionDetailDrawer
        transactionId={selectedTransactionId}
        open={!!selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  );
}
