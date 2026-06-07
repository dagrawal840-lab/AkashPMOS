import 'server-only';

interface Window {
  count: number;
  start: number;
}

const store = new Map<string, Window>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.start > WINDOW_MS) {
    store.set(key, { count: 1, start: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
