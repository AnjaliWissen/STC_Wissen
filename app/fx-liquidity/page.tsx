// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
// import { format } from 'date-fns';

// export default function FXLiquidityPage() {
//   const { data: fxRates, isLoading: fxLoading } = useQuery({
//     queryKey: ['fx-rates'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('fx_rates')
//         .select('*')
//         .order('timestamp', { ascending: false })
//         .limit(10);

//       if (error) throw error;
//       return data;
//     },
//   });

//   const { data: liquidityData, isLoading: liquidityLoading } = useQuery({
//     queryKey: ['bridge-liquidity'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('bridge_liquidity')
//         .select('*')
//         .order('network', { ascending: true });

//       if (error) throw error;
//       return data;
//     },
//   });

//   const { data: bridgeErrors, isLoading: errorsLoading } = useQuery({
//     queryKey: ['bridge-errors-list'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('bridge_errors')
//         .select('*, transactions(fabric_hash, sender_id, recipient_id)')
//         .order('created_at', { ascending: false })
//         .limit(20);

//       if (error) throw error;
//       return data;
//     },
//   });

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'healthy':
//         return <CheckCircle2 className="h-5 w-5 text-green-600" />;
//       case 'warning':
//         return <AlertTriangle className="h-5 w-5 text-amber-600" />;
//       case 'critical':
//         return <AlertTriangle className="h-5 w-5 text-red-600" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'healthy':
//         return 'default';
//       case 'warning':
//         return 'outline';
//       case 'critical':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">FX & Liquidity Monitoring</h2>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">Stellar-Fabric bridge status and exchange rates</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//           <CardHeader>
//             <CardTitle>Live FX Rates</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {fxLoading ? (
//               <div className="text-center py-8 text-gray-500">Loading rates...</div>
//             ) : (
//               <div className="space-y-3">
//                 {fxRates && fxRates.length > 0 ? (
//                   fxRates
//                     .reduce<typeof fxRates>((acc, rate) => {
//                       if (!acc.find((r) => r.currency_pair === rate.currency_pair)) {
//                         acc.push(rate);
//                       }
//                       return acc;
//                     }, [])
//                     .map((rate) => (
//                       <div
//                         key={rate.id}
//                         className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                       >
//                         <div>
//                           <div className="font-semibold text-lg">{rate.currency_pair}</div>
//                           <div className="text-xs text-gray-500">
//                             {format(new Date(rate.timestamp), 'MMM dd, HH:mm:ss')}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-blue-600">
//                             {Number(rate.rate).toFixed(4)}
//                           </div>
//                           <div className="text-xs text-gray-500">Stellar DEX</div>
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     No FX rates available
//                   </div>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//           <CardHeader>
//             <CardTitle>Bridge Liquidity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {liquidityLoading ? (
//               <div className="text-center py-8 text-gray-500">Loading liquidity data...</div>
//             ) : (
//               <div className="space-y-3">
//                 {liquidityData && liquidityData.length > 0 ? (
//                   liquidityData.map((liq) => (
//                     <div
//                       key={liq.id}
//                       className="flex items-center justify-between p-4 border rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         {getStatusIcon(liq.status)}
//                         <div>
//                           <div className="font-semibold">
//                             {liq.network.toUpperCase()} - {liq.currency}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Threshold: {Number(liq.threshold).toFixed(2)}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xl font-bold">
//                           {Number(liq.balance).toFixed(2)}
//                         </div>
//                         <Badge variant={getStatusColor(liq.status)}>
//                           {liq.status}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     No liquidity data available
//                   </div>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//         <CardHeader>
//           <CardTitle>Bridge Error Log</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {errorsLoading ? (
//             <div className="text-center py-8 text-gray-500">Loading errors...</div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Timestamp</TableHead>
//                     <TableHead>Error Type</TableHead>
//                     <TableHead>Transaction</TableHead>
//                     <TableHead>Error Message</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {bridgeErrors && bridgeErrors.length > 0 ? (
//                     bridgeErrors.map((error: any) => (
//                       <TableRow key={error.id}>
//                         <TableCell className="text-sm">
//                           {format(new Date(error.created_at), 'MMM dd, HH:mm:ss')}
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{error.error_type}</Badge>
//                         </TableCell>
//                         <TableCell className="font-mono text-xs">
//                           {error.transactions?.fabric_hash?.substring(0, 16)}...
//                         </TableCell>
//                         <TableCell className="text-sm max-w-md truncate">
//                           {error.error_message}
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant={error.resolved ? 'default' : 'destructive'}>
//                             {error.resolved ? 'Resolved' : 'Active'}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={5} className="text-center py-8 text-gray-500">
//                         No bridge errors found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';



const API_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/positions/net';


type StellarBridgeTx = {
  transactionId: string;
  stellarTxHash: string;
  amount: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  stctx_ext_id: string;
};


interface TransactionDetail {
  txId: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  timestamp: string;
  settled: boolean;
}

interface PositionData {
  lastUpdated: string;
  lastSettlementTime: string;
  positions: {
    [key: string]: number;
  };
  details: TransactionDetail[];
  summary: {
    kwOwes: number;
    bhOwes: number;
    kwReceives: number;
    bhReceives: number;
  };
}

export default function FXLiquidityPage() {
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPositionData = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error('Failed to fetch position data');
      }

      const json = await res.json();

      if (json.success && json.positions) {
        setPositionData(json.positions);
      }
    } catch (error) {
      console.error('Error fetching position data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStellarExplorerUrl = (hash: string) =>
  `https://stellar.expert/explorer/testnet/tx/${hash}`;


  const {
  data: bridgeTxs,
  isLoading: bridgesLoading,
  isError,
} = useQuery<StellarBridgeTx[]>({
  queryKey: ['stellar-bridges'],
  queryFn: async () => {
    const res = await fetch(
      'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/stellar/bridges'
    );
    if (!res.ok) throw new Error('Failed to load bridge transactions');
    return res.json();
  },
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-600">Confirmed</Badge>;
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="destructive">Failed</Badge>;
  }
};


  useEffect(() => {
    fetchPositionData();

    // Auto refresh every 10 seconds
    const interval = setInterval(fetchPositionData, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Position Summary</CardTitle>
          <CardDescription>Loading position data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!positionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Position Summary</CardTitle>
          <CardDescription>No position data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6">
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Position Summary</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Updated{' '}
              {formatDistanceToNow(new Date(positionData.lastUpdated), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Last Settlement:{' '}
            {new Date(positionData.lastSettlementTime).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Net Positions */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(positionData.positions).map(
            ([institution, balance]) => (
              <div
                key={institution}
                className="p-4 rounded-lg border bg-card"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {institution.replace('_', ' ')}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {balance >= 0 ? '+' : ''}
                    {formatAmount(balance)}
                  </p>

                  {balance >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-700 dark:text-red-400" />
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['KW Receives', positionData.summary.kwReceives, 'green'],
            ['KW Owes', positionData.summary.kwOwes, 'red'],
            ['BH Receives', positionData.summary.bhReceives, 'green'],
            ['BH Owes', positionData.summary.bhOwes, 'red'],
          ].map(([label, value, color]) => (
            <div
              key={label as string}
              className={`p-3 rounded-lg border bg-${color}-50 dark:bg-${color}-950/20`}
            >
              <p
                className={`text-xs font-medium text-${color}-700 dark:text-${color}-400`}
              >
                {label}
              </p>
              <p className="text-lg font-bold mt-1">
                {formatAmount(value as number)}
              </p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Transaction Details</h3>
            <Badge variant="secondary" className="ml-auto">
              {positionData.details.length} transactions
            </Badge>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {positionData.details.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  positionData.details.map((tx) => (
                    <TableRow key={tx.txId}>
                      <TableCell>{tx.from.replace('_', ' ')}</TableCell>
                      <TableCell>{tx.to.replace('_', ' ')}</TableCell>
                      <TableCell className="font-mono">
                        {formatAmount(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.currency}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.settled ? 'default' : 'secondary'}
                        >
                          {tx.settled ? 'Settled' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="rounded-lg border bg-card shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
  <CardHeader>
    <CardTitle>Stellar Bridge Transactions History</CardTitle>
    <CardDescription>
      Recent Stellar settlement bridge activity
    </CardDescription>
  </CardHeader>

  <CardContent>
    {bridgesLoading ? (
      <div className="text-center py-8 text-muted-foreground">
        Loading bridge transactions…
      </div>
    ) : isError ? (
      <div className="text-center py-8 text-red-500">
        Failed to load data
      </div>
    ) : bridgeTxs && bridgeTxs.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Txn ID</th>
              <th className="text-left p-3">Currency</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Stellar Hash</th>
              <th className="text-left p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {bridgeTxs?.map((tx) => (
              <tr
                key={tx.transactionId}
                className="border-b hover:bg-muted/40 transition"
              >
                <td className="p-3 font-mono text-xs truncate max-w-[140px]">
                  {tx.transactionId.slice(0, 12)}…
                </td>

                <td className="p-3">{tx.currency}</td>

                <td className="p-3 text-right font-medium">
                  {tx.amount}
                </td>

                <td className="p-3">
                  {getStatusBadge(tx.status)}
                </td>

                <td className="p-3 font-mono text-xs max-w-[200px] space-y-1">
  {tx.stellarTxHash ? (
    <>
      {/* Hash preview with tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer underline decoration-dotted block">
              {tx.stellarTxHash.slice(0, 12)}…
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <span className="font-mono text-xs break-all">
              {tx.stellarTxHash}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Explorer link only for confirmed tx */}
      {tx.status === 'confirmed' && (
        <a
          href={getStellarExplorerUrl(tx.stellarTxHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          View on Stellar Explorer →
        </a>
      )}
    </>
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</td>



                <td className="p-3 text-muted-foreground">
                  {format(new Date(tx.timestamp), 'PP p')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </CardContent>
</Card>

    </div>
  );
}
