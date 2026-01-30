'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Clock, AlertCircle, Wallet, Lock, Unlock, Coins } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


const BASE_URL = 'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/escrow/bahrain';

interface EscrowDetails {
  total: number;
  locked: number;
  available: number;
  currency: string;
  lockedPercentage: string;
}

interface TokenDetails {
  count: number;
  totalValue: number;
  breakdown: any[];
}

interface BahrainEscrowData {
  subsidiary: string;
  escrow: EscrowDetails;
  tokens: TokenDetails;
}

export function BahrainEscrowWidget() {
  const [escrowData, setEscrowData] = useState<BahrainEscrowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchEscrowData();
    const interval = setInterval(fetchEscrowData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEscrowData = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch Bahrain escrow data');
      const data = await response.json();
      setEscrowData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, decimals: number = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bahrain Escrow
          </CardTitle>
          <CardDescription>Loading escrow data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bahrain Escrow
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!escrowData) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bahrain Escrow
          </CardTitle>
          <CardDescription>No escrow data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const lockedPercentage = parseFloat(escrowData.escrow.lockedPercentage);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {escrowData.subsidiary}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-950">
            {escrowData.escrow.currency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-400">Total Escrow</span>
            <Wallet className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-900 dark:text-red-300">
            {formatAmount(escrowData.escrow.total)} {escrowData.escrow.currency}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Available</span>
            </div>
            <p className="text-xl font-bold text-green-900 dark:text-green-300">
              {formatAmount(escrowData.escrow.available)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{escrowData.escrow.currency}</p>
          </div>

          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Locked</span>
            </div>
            <p className="text-xl font-bold text-orange-900 dark:text-orange-300">
              {formatAmount(escrowData.escrow.locked)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{escrowData.escrow.currency}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Locked Percentage</span>
            <span className="font-semibold">{escrowData.escrow.lockedPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${lockedPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-400">Tokens</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{escrowData.tokens.count}</p>
            <span className="text-sm text-muted-foreground">tokens</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total Value: {formatAmount(escrowData.tokens.totalValue)} {escrowData.escrow.currency}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
