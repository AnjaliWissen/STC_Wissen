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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const API_BASE =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000';

type FxRate = {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
};

// 🔹 Define all FX pairs here (easy to extend later)
const FX_PAIRS = [
  { from: 'BHD', to: 'KWD' },
  { from: 'KWD', to: 'BHD' },
];

export default function FXLiquidityPage() {
  const { data, isLoading, error } = useQuery<FxRate[]>({
    queryKey: ['live-fx-rates'],
    queryFn: async () => {
      const responses = await Promise.all(
        FX_PAIRS.map(async ({ from, to }) => {
          const res = await fetch(`${API_BASE}/api/fx/${from}/${to}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch FX ${from} → ${to}`);
          }
          return res.json();
        })
      );

      return responses;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Live FX Rates
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time FX rates from Stellar DEX
        </p>
      </div>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">

        <CardHeader>
          <CardTitle>FX Rates</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              Loading FX rates…
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              {(error as Error).message}
            </div>
          )}

          <div className="space-y-4">
            {data?.map((fx) => (
              <div
                key={`${fx.fromCurrency}-${fx.toCurrency}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {fx.fromCurrency} → {fx.toCurrency}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(fx.timestamp), 'MMM dd, HH:mm:ss')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {fx.rate.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stellar DEX
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
