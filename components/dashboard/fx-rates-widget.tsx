// 'use client';

// import { Card } from '@/components/ui/card';
// import { TrendingUp, TrendingDown } from 'lucide-react';

// interface FXRate {
//   pair: string;
//   fullName: string;
//   rate: number;
//   change: number;
//   trend: number[];
// }

// const fxRates: FXRate[] = [
//   {
//     pair: 'KWD/USD',
//     fullName: 'Kuwaiti Dinar',
//     rate: 3.2586,
//     change: 0.12,
//     trend: [3.24, 3.25, 3.26, 3.27, 3.26, 3.25, 3.26, 3.2586]
//   },
//   {
//     pair: 'BHD/USD',
//     fullName: 'Bahraini Dinar',
//     rate: 2.6525,
//     change: -0.08,
//     trend: [2.66, 2.65, 2.66, 2.65, 2.66, 2.65, 2.66, 2.6525]
//   },
//   {
//     pair: 'AED/USD',
//     fullName: 'UAE Dirham',
//     rate: 0.2723,
//     change: 0.05,
//     trend: [0.272, 0.2721, 0.2722, 0.2723, 0.2722, 0.2721, 0.2722, 0.2723]
//   },
//   {
//     pair: 'SAR/USD',
//     fullName: 'Saudi Riyal',
//     rate: 0.2666,
//     change: 0.02,
//     trend: [0.2664, 0.2665, 0.2666, 0.2665, 0.2666, 0.2665, 0.2666, 0.2666]
//   },
//   {
//     pair: 'OMR/USD',
//     fullName: 'Omani Rial',
//     rate: 2.5974,
//     change: 0.15,
//     trend: [2.59, 2.595, 2.596, 2.597, 2.596, 2.595, 2.597, 2.5974]
//   }
// ];

// function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const range = max - min || 1;

//   const points = data.map((value, index) => {
//     const x = (index / (data.length - 1)) * 100;
//     const y = 100 - ((value - min) / range) * 100;
//     return `${x},${y}`;
//   }).join(' ');

//   return (
//     <svg
//       viewBox="0 0 100 40"
//       className="w-24 h-10 opacity-90"
//       preserveAspectRatio="none"
//     >
//       <defs>
//         <linearGradient id={`gradient-${isPositive ? 'green' : 'red'}`} x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
//           <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
//         </linearGradient>
//       </defs>
//       <polyline
//         points={points}
//         fill="none"
//         stroke={isPositive ? '#10b981' : '#ef4444'}
//         strokeWidth="2.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="drop-shadow-sm"
//       />
//     </svg>
//   );
// }

// export function FXRatesWidget() {
//   return (
//     <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
//       <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">FX Live Rates</h3>
//         <p className="text-sm text-gray-600 dark:text-gray-400">Real-time currency exchange rates</p>
//       </div>

//       <div className="space-y-2">
//         {fxRates.map((fx) => {
//           const isPositive = fx.change >= 0;

//           return (
//             <div
//               key={fx.pair}
//               className="flex items-center justify-between py-3 px-3 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 rounded-lg bg-white/50 dark:bg-gray-800/50"
//             >
//               <div className="flex-1">
//                 <div className="font-bold text-gray-900 dark:text-white">{fx.pair}</div>
//                 <div className="text-xs text-gray-600 dark:text-gray-400">{fx.fullName}</div>
//               </div>

//               <div className="flex-shrink-0 mx-4">
//                 <MiniSparkline data={fx.trend} isPositive={isPositive} />
//               </div>

//               <div className="text-right">
//                 <div className="font-bold text-lg text-gray-900 dark:text-white">{fx.rate.toFixed(4)}</div>
//                 <div className={`text-xs font-semibold px-2 py-1 rounded-md inline-flex items-center gap-1 ${
//                   isPositive
//                     ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
//                     : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
//                 }`}>
//                   {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
//                   {isPositive ? '+' : ''}{fx.change.toFixed(2)}%
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//         <span className="flex items-center gap-1">
//           <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
//           Live data
//         </span>
//         <span>Last updated: {new Date().toLocaleTimeString()}</span>
//       </div>
//     </Card>
//   );
// }

'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FXApiResponse {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
}

interface FXRateUI {
  pair: string;
  fullName: string;
  rate: number;
  change: number;
  trend: number[];
}

const BASE_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000/api';

function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 40" className="w-24 h-10 opacity-90" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FXRatesWidget() {
  const [rates, setRates] = useState<Record<string, FXRateUI>>({});

  const fetchRate = async (from: string, to: string, fullName: string) => {
    const res = await fetch(`${BASE_URL}/fx/${from}/${to}`);
    if (!res.ok) throw new Error('Failed to fetch FX rate');
    const data: FXApiResponse = await res.json();

    setRates((prev) => {
      const key = `${from}/${to}`;
      const prevRate = prev[key]?.rate ?? data.rate;
      const change = ((data.rate - prevRate) / prevRate) * 100;

      return {
        ...prev,
        [key]: {
          pair: key,
          fullName,
          rate: data.rate,
          change: isFinite(change) ? change : 0,
          trend: [...(prev[key]?.trend || [prevRate]), data.rate].slice(-8),
        },
      };
    });
  };

  useEffect(() => {
    fetchRate('KWD', 'BHD', 'Kuwaiti Dinar ↔ Bahraini Dinar');
    fetchRate('BHD', 'KWD', 'Bahraini Dinar ↔ Kuwaiti Dinar');

    const interval = setInterval(() => {
      fetchRate('KWD', 'BHD', 'Kuwaiti Dinar ↔ Bahraini Dinar');
      fetchRate('BHD', 'KWD', 'Bahraini Dinar ↔ Kuwaiti Dinar');
    }, 15000); // refresh every 15s

    return () => clearInterval(interval);
  }, []);

  const fxRates = Object.values(rates);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold">FX Live Rates</h3>
        <p className="text-sm text-gray-500">Real-time currency exchange rates</p>
      </div>

      <div className="space-y-2">
        {fxRates.map((fx) => {
          const isPositive = fx.change >= 0;

          return (
            <div
              key={fx.pair}
              className="flex items-center justify-between py-3 px-3 rounded-lg border hover:bg-white dark:hover:bg-gray-800 transition"
            >
              <div className="flex-1">
                <div className="font-bold">{fx.pair}</div>
                <div className="text-xs text-gray-500">{fx.fullName}</div>
              </div>

              <MiniSparkline data={fx.trend} isPositive={isPositive} />

              <div className="text-right ml-4">
                <div className="font-bold text-lg   text-green-700 dark:text-green-400">{fx.rate.toFixed(4)}</div>
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded-md inline-flex items-center gap-1 ${
                    isPositive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? '+' : ''}
                  {fx.change.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex justify-between">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live data
        </span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </Card>
  );
}
