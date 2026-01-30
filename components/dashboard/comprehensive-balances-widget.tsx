'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Clock, AlertCircle, ExternalLink, Lock, Unlock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BASE_URL = 'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/balances/comprehensive';

interface EscrowData {
  total: number;
  locked: number;
  available: number;
  currency: string;
}

interface TokenData {
  count: number;
  totalValue: number;
  currency: string;
}

interface StellarData {
  publicKey: string;
  balance: number;
  explorer: string;
}

interface SubsidiaryData {
  subsidiary: string;
  escrow: EscrowData;
  tokens: TokenData;
  stellar: StellarData;
}

interface ComprehensiveBalancesData {
  timestamp: string;
  kuwait: SubsidiaryData;
  bahrain: SubsidiaryData;
}

export function ComprehensiveBalancesWidget() {
  const [balanceData, setBalanceData] = useState<ComprehensiveBalancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalanceData();
    const interval = setInterval(fetchBalanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBalanceData = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch comprehensive balance data');
      const data = await response.json();
      setBalanceData(data);
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
            <Wallet className="h-5 w-5" />
            Comprehensive Balances
          </CardTitle>
          <CardDescription>Loading balance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
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
            <Wallet className="h-5 w-5" />
            Comprehensive Balances
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!balanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Comprehensive Balances
          </CardTitle>
          <CardDescription>No balance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderSubsidiary = (data: SubsidiaryData) => (
    <div className="space-y-4 p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{data.subsidiary}</h3>
        <Badge variant="outline" className="text-xs">
          {data.escrow.currency}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Escrow Total</span>
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {formatAmount(data.escrow.total)} {data.escrow.currency}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-1">
              <Unlock className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs text-muted-foreground">Available:</span>
              <span className="text-xs font-semibold">{formatAmount(data.escrow.available)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              <span className="text-xs text-muted-foreground">Locked:</span>
              <span className="text-xs font-semibold">{formatAmount(data.escrow.locked)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border">
            <p className="text-xs text-muted-foreground mb-1">Tokens</p>
            <p className="text-lg font-bold">{data.tokens.count}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Value: {formatAmount(data.tokens.totalValue)} {data.tokens.currency}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-1">Stellar Balance</p>
            <p className="text-lg font-bold text-yellow-900 dark:text-yellow-300">
              {formatAmount(data.stellar.balance, 7)}
            </p>
          </div>
        </div>

        <div className="p-2 rounded bg-muted/50 border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Stellar Public Key</p>
              <p className="text-xs font-mono truncate">{data.stellar.publicKey}</p>
            </div>
            <a
              href={data.stellar.explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 hover:bg-accent rounded transition-colors"
              title="View on Stellar Explorer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Comprehensive Balances
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Updated {formatDistanceToNow(new Date(balanceData.timestamp), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Complete Overview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSubsidiary(balanceData.kuwait)}
        {renderSubsidiary(balanceData.bahrain)}
      </CardContent>
    </Card>
  );
}
