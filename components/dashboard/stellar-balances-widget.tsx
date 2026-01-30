'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BASE_URL = 'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api/stellar/balances';

interface AccountData {
  publicKey: string;
  balance: number;
  explorer: string;
}

interface StellarBalancesData {
  success: boolean;
  timestamp: string;
  kuwait: AccountData;
  bahrain: AccountData;
}

export function StellarBalancesWidget() {
  const [stellarData, setStellarData] = useState<StellarBalancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    fetchStellarData();
    const interval = setInterval(fetchStellarData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStellarData = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch Stellar balance data');
      const data = await response.json();
      setStellarData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }).format(balance);
  };

  const truncateKey = (key: string) => {
    return `${key.slice(0, 8)}...${key.slice(-8)}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Stellar Balances
          </CardTitle>
          <CardDescription>Loading Stellar data...</CardDescription>
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
            <Coins className="h-5 w-5" />
            Stellar Balances
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stellarData) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Stellar Balances
          </CardTitle>
          <CardDescription>No Stellar balance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalBalance = stellarData.kuwait.balance + stellarData.bahrain.balance;

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Stellar Balances
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950">
            XLM
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Balance</span>
            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
            {formatBalance(totalBalance)} XLM
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Kuwait Account</h3>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900">
                KW
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                  {formatBalance(stellarData.kuwait.balance)} XLM
                </p>
              </div>
              <div className="pt-2 border-t border-green-200 dark:border-green-800">
                <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate">
                    {truncateKey(stellarData.kuwait.publicKey)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => copyToClipboard(stellarData.kuwait.publicKey, 'Kuwait public key')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => window.open(stellarData.kuwait.explorer, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border border-red-200 dark:border-red-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Bahrain Account</h3>
              <Badge variant="secondary" className="bg-red-100 dark:bg-red-900">
                BH
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-300">
                  {formatBalance(stellarData.bahrain.balance)} XLM
                </p>
              </div>
              <div className="pt-2 border-t border-red-200 dark:border-red-800">
                <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate">
                    {truncateKey(stellarData.bahrain.publicKey)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => copyToClipboard(stellarData.bahrain.publicKey, 'Bahrain public key')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => window.open(stellarData.bahrain.explorer, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
