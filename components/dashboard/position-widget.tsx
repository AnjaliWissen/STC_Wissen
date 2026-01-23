// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { supabase } from '@/lib/supabase';
// import { ArrowUpDown, TrendingUp, TrendingDown, Clock } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// interface TransactionDetail {
//   txId: string;
//   from: string;
//   to: string;
//   amount: number;
//   currency: string;
//   timestamp: string;
//   settled: boolean;
// }

// interface PositionData {
//   lastUpdated: string;
//   lastSettlementTime: string;
//   positions: {
//     [key: string]: number;
//   };
//   details: TransactionDetail[];
//   summary: {
//     kwOwes: number;
//     bhOwes: number;
//     kwReceives: number;
//     bhReceives: number;
//   };
// }

// export function PositionWidget() {
//   const [positionData, setPositionData] = useState<PositionData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPositionData();

//     const channel = supabase
//       .channel('positions_changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'positions' },
//         () => {
//           fetchPositionData();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const fetchPositionData = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('positions')
//         .select('*')
//         .eq('config_key', 'current_positions')
//         .maybeSingle();

//       if (error) throw error;

//       if (data) {
//         setPositionData({
//           lastUpdated: data.last_updated,
//           lastSettlementTime: data.last_settlement_time,
//           positions: data.positions || {},
//           details: data.details || [],
//           summary: data.summary || {},
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching position data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Position Summary</CardTitle>
//           <CardDescription>Loading position data...</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!positionData) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Position Summary</CardTitle>
//           <CardDescription>No position data available</CardDescription>
//         </CardHeader>
//       </Card>
//     );
//   }

//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>Position Summary</CardTitle>
//             <CardDescription className="flex items-center gap-2 mt-1">
//               <Clock className="h-3 w-3" />
//               Updated {formatDistanceToNow(new Date(positionData.lastUpdated), { addSuffix: true })}
//             </CardDescription>
//           </div>
//           <Badge variant="outline" className="text-xs">
//             Last Settlement: {new Date(positionData.lastSettlementTime).toLocaleDateString()}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           {Object.entries(positionData.positions).map(([institution, balance]) => (
//             <div
//               key={institution}
//               className="p-4 rounded-lg border bg-card"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">
//                     {institution.replace('_', ' ')}
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                       {balance >= 0 ? '+' : ''}{formatAmount(balance)}
//                     </p>
//                     {balance >= 0 ? (
//                       <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
//                     ) : (
//                       <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
//             <p className="text-xs text-green-700 dark:text-green-400 font-medium">KW Receives</p>
//             <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
//               {formatAmount(positionData.summary.kwReceives)}
//             </p>
//           </div>
//           <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
//             <p className="text-xs text-red-700 dark:text-red-400 font-medium">KW Owes</p>
//             <p className="text-lg font-bold text-red-900 dark:text-red-300 mt-1">
//               {formatAmount(positionData.summary.kwOwes)}
//             </p>
//           </div>
//           <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
//             <p className="text-xs text-green-700 dark:text-green-400 font-medium">BH Receives</p>
//             <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
//               {formatAmount(positionData.summary.bhReceives)}
//             </p>
//           </div>
//           <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
//             <p className="text-xs text-red-700 dark:text-red-400 font-medium">BH Owes</p>
//             <p className="text-lg font-bold text-red-900 dark:text-red-300 mt-1">
//               {formatAmount(positionData.summary.bhOwes)}
//             </p>
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center gap-2 mb-3">
//             <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
//             <h3 className="font-semibold text-sm">Transaction Details</h3>
//             <Badge variant="secondary" className="ml-auto">
//               {positionData.details.length} {positionData.details.length === 1 ? 'transaction' : 'transactions'}
//             </Badge>
//           </div>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>From</TableHead>
//                   <TableHead>To</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Currency</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {positionData.details.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
//                       No transactions found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   positionData.details.map((detail) => (
//                     <TableRow key={detail.txId}>
//                       <TableCell className="font-medium">
//                         {detail.from.replace('_', ' ')}
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {detail.to.replace('_', ' ')}
//                       </TableCell>
//                       <TableCell className="font-mono">
//                         {formatAmount(detail.amount)}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{detail.currency}</Badge>
//                       </TableCell>
//                       <TableCell className="text-sm text-muted-foreground">
//                         {new Date(detail.timestamp).toLocaleString()}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={detail.settled ? 'default' : 'secondary'}>
//                           {detail.settled ? 'Settled' : 'Pending'}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


'use client';

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

const API_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/positions/net';

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

export function PositionWidget() {

  return null;
  // const [positionData, setPositionData] = useState<PositionData | null>(null);
  // const [loading, setLoading] = useState(true);

  // const fetchPositionData = async () => {
  //   try {
  //     const res = await fetch(API_URL);

  //     if (!res.ok) {
  //       throw new Error('Failed to fetch position data');
  //     }

  //     const json = await res.json();

  //     if (json.success && json.positions) {
  //       setPositionData(json.positions);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching position data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPositionData();

  //   // Auto refresh every 10 seconds
  //   const interval = setInterval(fetchPositionData, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  // const formatAmount = (amount: number) =>
  //   new Intl.NumberFormat('en-US', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(amount);

  // if (loading) {
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Position Summary</CardTitle>
  //         <CardDescription>Loading position data...</CardDescription>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         {[1, 2, 3].map((i) => (
  //           <div
  //             key={i}
  //             className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
  //           />
  //         ))}
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // if (!positionData) {
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Position Summary</CardTitle>
  //         <CardDescription>No position data available</CardDescription>
  //       </CardHeader>
  //     </Card>
  //   );
  // }

  // return (
  //   <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
  //     <CardHeader>
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <CardTitle>Position Summary</CardTitle>
  //           <CardDescription className="flex items-center gap-2 mt-1">
  //             <Clock className="h-3 w-3" />
  //             Updated{' '}
  //             {formatDistanceToNow(new Date(positionData.lastUpdated), {
  //               addSuffix: true,
  //             })}
  //           </CardDescription>
  //         </div>
  //         <Badge variant="outline" className="text-xs">
  //           Last Settlement:{' '}
  //           {new Date(positionData.lastSettlementTime).toLocaleDateString()}
  //         </Badge>
  //       </div>
  //     </CardHeader>

  //     <CardContent className="space-y-6">
  //       {/* Net Positions */}
  //       <div className="grid grid-cols-2 gap-4">
  //         {Object.entries(positionData.positions).map(
  //           ([institution, balance]) => (
  //             <div
  //               key={institution}
  //               className="p-4 rounded-lg border bg-card"
  //             >
  //               <p className="text-sm font-medium text-muted-foreground">
  //                 {institution.replace('_', ' ')}
  //               </p>

  //               <div className="flex items-center gap-2 mt-1">
  //                 <p
  //                   className={`text-2xl font-bold ${
  //                     balance >= 0
  //                       ? 'text-green-600 dark:text-green-400'
  //                       : 'text-red-600 dark:text-red-400'
  //                   }`}
  //                 >
  //                   {balance >= 0 ? '+' : ''}
  //                   {formatAmount(balance)}
  //                 </p>

  //                 {balance >= 0 ? (
  //                   <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-400" />
  //                 ) : (
  //                   <TrendingDown className="h-5 w-5 text-red-700 dark:text-red-400" />
  //                 )}
  //               </div>
  //             </div>
  //           )
  //         )}
  //       </div>

  //       {/* Summary */}
  //       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  //         {[
  //           ['KW Receives', positionData.summary.kwReceives, 'green'],
  //           ['KW Owes', positionData.summary.kwOwes, 'red'],
  //           ['BH Receives', positionData.summary.bhReceives, 'green'],
  //           ['BH Owes', positionData.summary.bhOwes, 'red'],
  //         ].map(([label, value, color]) => (
  //           <div
  //             key={label as string}
  //             className={`p-3 rounded-lg border bg-${color}-50 dark:bg-${color}-950/20`}
  //           >
  //             <p
  //               className={`text-xs font-medium text-${color}-700 dark:text-${color}-400`}
  //             >
  //               {label}
  //             </p>
  //             <p className="text-lg font-bold mt-1">
  //               {formatAmount(value as number)}
  //             </p>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Transactions */}
  //       <div>
  //         <div className="flex items-center gap-2 mb-3">
  //           <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
  //           <h3 className="font-semibold text-sm">Transaction Details</h3>
  //           <Badge variant="secondary" className="ml-auto">
  //             {positionData.details.length} transactions
  //           </Badge>
  //         </div>

  //         <div className="rounded-md border">
  //           <Table>
  //             <TableHeader>
  //               <TableRow>
  //                 <TableHead>From</TableHead>
  //                 <TableHead>To</TableHead>
  //                 <TableHead>Amount</TableHead>
  //                 <TableHead>Currency</TableHead>
  //                 <TableHead>Time</TableHead>
  //                 <TableHead>Status</TableHead>
  //               </TableRow>
  //             </TableHeader>

  //             <TableBody>
  //               {positionData.details.length === 0 ? (
  //                 <TableRow>
  //                   <TableCell
  //                     colSpan={6}
  //                     className="text-center py-8 text-muted-foreground"
  //                   >
  //                     No transactions found
  //                   </TableCell>
  //                 </TableRow>
  //               ) : (
  //                 positionData.details.map((tx) => (
  //                   <TableRow key={tx.txId}>
  //                     <TableCell>{tx.from.replace('_', ' ')}</TableCell>
  //                     <TableCell>{tx.to.replace('_', ' ')}</TableCell>
  //                     <TableCell className="font-mono">
  //                       {formatAmount(tx.amount)}
  //                     </TableCell>
  //                     <TableCell>
  //                       <Badge variant="outline">{tx.currency}</Badge>
  //                     </TableCell>
  //                     <TableCell className="text-sm text-muted-foreground">
  //                       {new Date(tx.timestamp).toLocaleString()}
  //                     </TableCell>
  //                     <TableCell>
  //                       <Badge
  //                         variant={tx.settled ? 'default' : 'secondary'}
  //                       >
  //                         {tx.settled ? 'Settled' : 'Pending'}
  //                       </Badge>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))
  //               )}
  //             </TableBody>
  //           </Table>
  //         </div>
  //       </div>
  //     </CardContent>
  //   </Card>
  // );
}
