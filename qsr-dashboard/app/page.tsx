import { getMarketData } from '@/lib/polygon';
import TickerCard from '@/components/TickerCard';
import BTCCard from '@/components/BTCCard';
import PriceChart from '@/components/PriceChart';
import AIBrief from '@/components/AIBrief';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 300;

async function MarketSection() {
  let data;
  try {
    data = await getMarketData();
  } catch {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        Market data unavailable. Check your POLYGON_API_KEY configuration.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.quotes.map((q) => (
          <TickerCard key={q.ticker} quote={q} />
        ))}
        <BTCCard btc={data.btc} />
      </div>

      <ErrorBoundary>
        <PriceChart quotes={data.quotes} />
      </ErrorBoundary>

      <p className="text-right text-xs text-gray-400">
        Data as of {new Date(data.fetchedAt).toLocaleTimeString()} · refreshes every 5 min
      </p>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">QSR Market Intelligence</h1>
          <p className="mt-1 text-sm text-gray-500">
            Live equities for Yum Brands and QSR peers · BTC risk sentiment · AI competitive brief
          </p>
        </header>

        <div className="space-y-6">
          <ErrorBoundary
            fallback={
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Market data failed to load.
              </div>
            }
          >
            <MarketSection />
          </ErrorBoundary>

          <ErrorBoundary>
            <AIBrief />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
