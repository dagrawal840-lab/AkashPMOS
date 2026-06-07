import 'server-only';

const BASE_URL = 'https://api.polygon.io';

function getApiKey(): string {
  const key = process.env.POLYGON_API_KEY;
  if (!key || key === 'REPLACE_ME') {
    throw new Error('POLYGON_API_KEY is not configured');
  }
  return key;
}

const QSR_TICKERS = ['YUM', 'MCD', 'CMG', 'SHAK', 'WEN', 'QSR'] as const;
export type QSRTicker = typeof QSR_TICKERS[number];

const TICKER_NAMES: Record<string, string> = {
  YUM: 'Yum Brands',
  MCD: "McDonald's",
  CMG: 'Chipotle',
  SHAK: 'Shake Shack',
  WEN: "Wendy's",
  QSR: 'Restaurant Brands',
};

interface PolygonSnapshotResult {
  ticker: string;
  day?: { c?: number; o?: number };
  prevDay?: { c?: number };
  todaysChangePerc?: number;
  todaysChange?: number;
}

async function fetchTicker(ticker: string): Promise<PolygonSnapshotResult | null> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/${encodeURIComponent(ticker)}?apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    console.error(`Polygon fetch failed for ${ticker}: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data?.ticker ?? null;
}

async function fetchBTC(): Promise<{ price: number; change: number; changePercent: number } | null> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD?apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    console.error(`Polygon BTC fetch failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  const t = data?.ticker;
  if (!t) return null;

  const price = t.day?.c ?? t.lastTrade?.p ?? 0;
  const prevClose = t.prevDay?.c ?? 0;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return { price, change, changePercent };
}

export async function getMarketData() {
  const [tickerResults, btc] = await Promise.allSettled([
    Promise.all(QSR_TICKERS.map(fetchTicker)),
    fetchBTC(),
  ]);

  const rawTickers = tickerResults.status === 'fulfilled' ? tickerResults.value : [];
  const btcData = btc.status === 'fulfilled' ? btc.value : null;

  const quotes = rawTickers
    .filter((t): t is PolygonSnapshotResult => t !== null)
    .map((t) => ({
      ticker: t.ticker,
      price: t.day?.c ?? 0,
      change: t.todaysChange ?? 0,
      changePercent: t.todaysChangePerc ?? 0,
      name: TICKER_NAMES[t.ticker] ?? t.ticker,
    }));

  return {
    quotes,
    btc: btcData,
    fetchedAt: new Date().toISOString(),
  };
}
