'use client';

import { useQuery,keepPreviousData } from '@tanstack/react-query';
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

type PaginatedBridgeResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  bridges: StellarBridgeTx[];
};


export default function FXLiquidityPage() {
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bridgePage, setBridgePage] = useState(1);
  const BRIDGE_LIMIT = 10;

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


type PaginatedBridgeResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  bridges: StellarBridgeTx[];
};



const {
  data: bridgeData,
  isLoading: bridgesLoading,
  isError,
  isFetching,
} = useQuery<PaginatedBridgeResponse>({
  queryKey: ['stellar-bridges', bridgePage],
  queryFn: async () => {
    const res = await fetch(
      `http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/stellar/bridges?page=${bridgePage}&limit=${BRIDGE_LIMIT}`
    );

    if (!res.ok) {
      throw new Error('Failed to load bridge transactions');
    }

    return res.json();
  },


  placeholderData: keepPreviousData,
});
const bridgeTxs = bridgeData?.bridges ?? [];




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
  }).format(Number(amount));

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
      

 <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settlement & Bridge Monitoring
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
         Live net positions and Stellar bridge status
        </p>
      </div>
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
            {bridgeTxs.map((tx) => (
              <tr
                key={tx.transactionId}
                className="border-b hover:bg-muted/40 transition"
              >
                <td className="p-3 font-mono text-xs truncate max-w-[140px]">
                  {tx.transactionId.slice(0, 12)}…
                </td>

                <td className="p-3">{tx.currency}</td>

                <td className="p-3 text-right font-medium">
                  {formatAmount(tx.amount)}
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
        {bridgeData && (
  <div className="flex items-center justify-between mt-4 text-sm">
    <div className="text-muted-foreground">
      Page {bridgeData.page} of {bridgeData.totalPages} •{' '}
      {bridgeData.total} total transactions
    </div>

    <div className="flex gap-2">
      <button
        disabled={!bridgeData.hasPrevPage}
        onClick={() => setBridgePage((p) => p - 1)}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Previous
      </button>

      <button
        disabled={!bridgeData.hasNextPage}
        onClick={() => setBridgePage((p) => p + 1)}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
)}

      </div>
    )}
  </CardContent>
</Card>

    </div>
  );
}


