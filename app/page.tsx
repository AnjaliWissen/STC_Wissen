'use client';

import { NodeStatusGrid } from '@/components/dashboard/node-status-grid';
import { TPSChart } from '@/components/dashboard/tps-chart';
import { LatencyChart } from '@/components/dashboard/latency-chart';
import { ResourceUtilization } from '@/components/dashboard/resource-utilization';
import { FXRatesWidget } from '@/components/dashboard/fx-rates-widget';
import { PositionWidget } from '@/components/dashboard/position-widget';
import { BahrainEscrowWidget } from '@/components/dashboard/bahrain-escrow-widget';
import { KuwaitEscrowWidget } from '@/components/dashboard/kuwait-escrow-widget';
import { ComprehensiveBalancesWidget } from '@/components/dashboard/comprehensive-balances-widget';
import { StellarBalancesWidget } from '@/components/dashboard/stellar-balances-widget';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Network Health Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time infrastructure metrics and performance monitoring</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <NodeStatusGrid />
        </div>
        <div>
          <FXRatesWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TPSChart />
        <LatencyChart />
      </div>

      
      <PositionWidget />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComprehensiveBalancesWidget />
        <StellarBalancesWidget />
    
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KuwaitEscrowWidget />
        <BahrainEscrowWidget />
      </div>
      <ResourceUtilization />
      
    </div>
  );
}
