'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Settings2, TrendingUp, FileText, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

interface SystemConfig {
  id: string;
  config_key: string;
  auto_eod: {
    enabled: boolean;
    time: string;
    method: string;
  };
  auto_stellar: {
    enabled: boolean;
    checkInterval: number;
    autoSettle: boolean;
  };
  settlement: {
    allowPartialSettlement: boolean;
    requireNetPositionMatch: boolean;
  };
  settled_periods: string[];
  updated_at: string;
  created_at: string;
}

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPeriod, setNewPeriod] = useState('');

  const { data: config, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .eq('config_key', 'main_config')
        .maybeSingle();

      if (error) throw error;
      return data as SystemConfig;
    },
  });

  const [formData, setFormData] = useState<Partial<SystemConfig>>({});

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const updateConfigMutation = useMutation({
    mutationFn: async (updatedConfig: Partial<SystemConfig>) => {
      const { data, error } = await supabase
        .from('system_config')
        .update(updatedConfig)
        .eq('config_key', 'main_config')
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      toast({
        title: 'Settings Updated',
        description: 'System configuration has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update system configuration.',
        variant: 'destructive',
      });
      console.error('Update error:', error);
    },
  });

  const handleSave = () => {
    if (!formData) return;
    updateConfigMutation.mutate(formData);
  };

  const updateAutoEOD = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      auto_eod: {
        ...(prev.auto_eod || { enabled: false, time: '23:59', method: 'stellar' }),
        [field]: value,
      },
    }));
  };

  const updateAutoStellar = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      auto_stellar: {
        ...(prev.auto_stellar || { enabled: false, checkInterval: 120, autoSettle: true }),
        [field]: value,
      },
    }));
  };

  const updateSettlement = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      settlement: {
        ...(prev.settlement || { allowPartialSettlement: false, requireNetPositionMatch: true }),
        [field]: value,
      },
    }));
  };

  const addSettledPeriod = () => {
    if (!newPeriod || !formData) return;

    const periods = formData.settled_periods || [];
    if (periods.includes(newPeriod)) {
      toast({
        title: 'Duplicate Period',
        description: 'This period has already been added.',
        variant: 'destructive',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      settled_periods: [...periods, newPeriod],
    }));
    setNewPeriod('');
  };

  const removeSettledPeriod = (period: string) => {
    setFormData((prev) => ({
      ...prev,
      settled_periods: (prev.settled_periods || []).filter((p) => p !== period),
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">Loading configuration...</div>
      </div>
    );
  }

  if (!formData || !config) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">No configuration found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure system-wide automation and settlement rules
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateConfigMutation.isPending}>
          {updateConfigMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Auto End-of-Day (EOD)
            </CardTitle>
            <CardDescription>
              Automated end-of-day processing configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="eod-enabled" className="text-base">Enable Auto EOD</Label>
              <Switch
                id="eod-enabled"
                checked={formData.auto_eod?.enabled || false}
                onCheckedChange={(checked) => updateAutoEOD('enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eod-time">EOD Time</Label>
              <Input
                id="eod-time"
                type="time"
                value={formData.auto_eod?.time || '23:59'}
                onChange={(e) => updateAutoEOD('time', e.target.value)}
                disabled={!formData.auto_eod?.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eod-method">EOD Method</Label>
              <select
                id="eod-method"
                value={formData.auto_eod?.method || 'stellar'}
                onChange={(e) => updateAutoEOD('method', e.target.value)}
                disabled={!formData.auto_eod?.enabled}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="stellar">Stellar</option>
                <option value="fabric">Fabric</option>
                <option value="both">Both</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Auto Stellar Processing
            </CardTitle>
            <CardDescription>
              Automated Stellar network processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="stellar-enabled" className="text-base">Enable Auto Stellar</Label>
              <Switch
                id="stellar-enabled"
                checked={formData.auto_stellar?.enabled || false}
                onCheckedChange={(checked) => updateAutoStellar('enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="check-interval">Check Interval (seconds)</Label>
              <Input
                id="check-interval"
                type="number"
                value={formData.auto_stellar?.checkInterval || 120}
                onChange={(e) => updateAutoStellar('checkInterval', parseInt(e.target.value))}
                disabled={!formData.auto_stellar?.enabled}
                min="30"
                max="3600"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-settle" className="text-base">Auto Settle</Label>
              <Switch
                id="auto-settle"
                checked={formData.auto_stellar?.autoSettle || false}
                onCheckedChange={(checked) => updateAutoStellar('autoSettle', checked)}
                disabled={!formData.auto_stellar?.enabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-purple-600" />
              Settlement Rules
            </CardTitle>
            <CardDescription>
              Configure settlement processing rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="partial-settlement" className="text-base">
                Allow Partial Settlement
              </Label>
              <Switch
                id="partial-settlement"
                checked={formData.settlement?.allowPartialSettlement || false}
                onCheckedChange={(checked) => updateSettlement('allowPartialSettlement', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="net-position-match" className="text-base">
                Require Net Position Match
              </Label>
              <Switch
                id="net-position-match"
                checked={formData.settlement?.requireNetPositionMatch || false}
                onCheckedChange={(checked) => updateSettlement('requireNetPositionMatch', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              Settled Periods
            </CardTitle>
            <CardDescription>
              Manage completed settlement periods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="date"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                placeholder="Select date"
              />
              <Button onClick={addSettledPeriod} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {formData.settled_periods && formData.settled_periods.length > 0 ? (
                formData.settled_periods.map((period) => (
                  <div
                    key={period}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      <span className="font-mono text-sm">{period}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSettledPeriod(period)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No settled periods recorded
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {config.updated_at && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Last updated: {format(new Date(config.updated_at), 'PPpp')}</span>
              <Badge variant="outline">Configuration Version</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
