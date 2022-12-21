import { RateLimiter } from "limiter";

export const slippiLimiter = new RateLimiter({ tokensPerInterval: 2, interval: "second" });