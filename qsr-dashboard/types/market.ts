export interface TickerQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
}

export interface BTCQuote {
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketData {
  quotes: TickerQuote[];
  btc: BTCQuote | null;
  fetchedAt: string;
}

export interface AIBriefResponse {
  brief: string;
  generatedAt: string;
}

export interface RateLimitState {
  count: number;
  windowStart: number;
}
