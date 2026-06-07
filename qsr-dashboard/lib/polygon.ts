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
export type QSRTicker = (typeof QSR_TICKERS)[number];

const TICKER_NAMES: Record<string, string> = {
  YUM: 'Yum Brands',
  MCD: "McDonald's",
  CMG: 'Chipotle',
  SHAK: 'Shake Shack',
  WEN: "Wendy's",
  QSR: 'Restaurant Brands',
};

interface AggResult {
  c: number; // close
  o: number; // open
  h: number; // high
  l: number; // low
  v: number; // volume
  t: number; // timestamp
}

interface PolygonAggsResponse {
  ticker: string;
  results?: AggResult[];
  status: string;
}

// Free-tier endpoint: previous trading day close
async function fetchPrevClose(ticker: string): Promise<{ ticker: string; close: number; open: number } | null> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev?adjusted=true&apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Polygon prev-close failed for ${ticker}: ${res.status}`);
    return null;
  }

  const data: PolygonAggsResponse = await res.json();
  const result = data.results?.[0];
  if (!result) return null;

  return { ticker, close: result.c, open: result.o };
}

// Two-day aggregates so we can compute day-over-day change
async function fetchTwoDayAgg(ticker: string): Promise<{ ticker: string; price: number; change: number; changePercent: number } | null> {
  const apiKey = getApiKey();
  // Get last 2 trading days
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 5); // go back 5 calendar days to cover weekends
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url = `${BASE_URL}/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=desc&limit=2&apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Polygon aggs failed for ${ticker}: ${res.status}`);
    return null;
  }

  const data: PolygonAggsResponse = await res.json();
  const results = data.results;
  if (!results || results.length === 0) return null;

  const latest = results[0];
  const prev = results[1];

  const price = latest.c;
  const prevClose = prev?.c ?? latest.o;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return { ticker, price, change, changePercent };
}

async function fetchBTC(): Promise<{ price: number; change: number; changePercent: number } | null> {
  const apiKey = getApiKey();
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 3);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url = `${BASE_URL}/v2/aggs/ticker/X:BTCUSD/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=desc&limit=2&apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Polygon BTC aggs failed: ${res.status}`);
    return null;
  }

  const data: PolygonAggsResponse = await res.json();
  const results = data.results;
  if (!results || results.length === 0) return null;

  const latest = results[0];
  const prev = results[1];

  const price = latest.c;
  const prevClose = prev?.c ?? latest.o;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return { price, change, changePercent };
}

export async function getMarketData() {
  const [tickerResults, btc] = await Promise.allSettled([
    Promise.all(QSR_TICKERS.map(fetchTwoDayAgg)),
    fetchBTC(),
  ]);

  const rawTickers = tickerResults.status === 'fulfilled' ? tickerResults.value : [];
  const btcData = btc.status === 'fulfilled' ? btc.value : null;

  const quotes = rawTickers
    .filter((t): t is NonNullable<typeof t> => t !== null)
    .map((t) => ({
      ticker: t.ticker,
      price: t.price,
      change: t.change,
      changePercent: t.changePercent,
      name: TICKER_NAMES[t.ticker] ?? t.ticker,
    }));

  return {
    quotes,
    btc: btcData,
    fetchedAt: new Date().toISOString(),
  };
}
