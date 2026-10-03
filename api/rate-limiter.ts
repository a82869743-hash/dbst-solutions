// Lightweight sliding-window rate limiter for serverless endpoints
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer && typeof timer === "object" && "unref" in timer) {
    (timer as any).unref();
  }
}

export function isRateLimited(
  identifier: string,
  limit = 20,
  windowMs = 60 * 1000
): { limited: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const cleanId = (identifier || "unknown").trim();
  const record = rateLimitMap.get(cleanId);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(cleanId, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, retryAfterSec: 0 };
  }

  record.count += 1;
  if (record.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { limited: true, remaining: 0, retryAfterSec };
  }

  return { limited: false, remaining: limit - record.count, retryAfterSec: 0 };
}

export function getClientIp(req: any): string {
  if (!req) return "127.0.0.1";
  // Handle Web API Request (headers.get) or Node.js IncomingMessage (headers[key])
  if (req.headers && typeof req.headers.get === "function") {
    const xForwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    if (xForwardedFor) {
      return xForwardedFor.split(",")[0].trim();
    }
  } else if (req.headers) {
    const xForwardedFor = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
    if (xForwardedFor) {
      const ips = (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor).split(",");
      return ips[0].trim();
    }
  }
  return req?.socket?.remoteAddress || req?.connection?.remoteAddress || "127.0.0.1";
}
