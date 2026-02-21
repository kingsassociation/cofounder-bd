const rateLimitMap = new Map<string, number[]>();
export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}
export function isRateLimited(key: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < options.windowMs,
  );
  if (recentTimestamps.length >= options.limit) {
    return true;
  }
  recentTimestamps.push(now);
  rateLimitMap.set(key, recentTimestamps);
  if (rateLimitMap.size > 1000) {
    const keysToDelete = Array.from(rateLimitMap.keys()).slice(0, 100);
    keysToDelete.forEach((k) => rateLimitMap.delete(k));
  }
  return false;
}
