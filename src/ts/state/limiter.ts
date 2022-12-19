import { RateLimiter } from "limiter";

export const slippiLimiter = new RateLimiter({ tokensPerInterval: 1, interval: "second" });