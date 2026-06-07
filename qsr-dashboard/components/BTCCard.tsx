'use client';

import type { BTCQuote } from '@/types/market';

interface Props {
  btc: BTCQuote | null;
}

export default function BTCCard({ btc }: Props) {
  if (!btc) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">BTC/USD</p>
        <p className="mt-2 text-sm text-gray-400">Unavailable</p>
      </div>
    );
  }

  const isPositive = btc.changePercent >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-500';
  const bg = isPositive ? 'bg-green-50' : 'bg-red-50';
  const sign = isPositive ? '+' : '';

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">
            BTC/USD
          </p>
          <p className="mt-0.5 text-sm text-gray-600">Risk Sentiment</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${color}`}>
          {sign}{btc.changePercent.toFixed(2)}%
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">
        ${btc.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      </p>
      <p className={`mt-1 text-sm ${color}`}>
        {sign}${Math.abs(btc.change).toFixed(0)} today
      </p>
    </div>
  );
}
