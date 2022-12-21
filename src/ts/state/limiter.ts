import { RateLimiter } from "limiter";

export const slippiLimiter = new RateLimiter({ tokensPerInterval: 5, interval: "second" });