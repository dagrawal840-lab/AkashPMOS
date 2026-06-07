'use client';

import type { TickerQuote } from '@/types/market';

interface Props {
  quote: TickerQuote;
}

export default function TickerCard({ quote }: Props) {
  const isPositive = quote.changePercent >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-500';
  const bg = isPositive ? 'bg-green-50' : 'bg-red-50';
  const sign = isPositive ? '+' : '';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {quote.ticker}
          </p>
          <p className="mt-0.5 text-sm text-gray-600">{quote.name}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${color}`}>
          {sign}{quote.changePercent.toFixed(2)}%
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">
        ${quote.price.toFixed(2)}
      </p>
      <p className={`mt-1 text-sm ${color}`}>
        {sign}{quote.change.toFixed(2)} today
      </p>
    </div>
  );
}
