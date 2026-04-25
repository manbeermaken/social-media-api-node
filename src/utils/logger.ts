import pino from "pino";
import env from "../config/env.js";

const isProduction = env.NODE_ENV === "prod";

const logger = pino({
  level: env.LOG_LEVEL,
  redact: ["req.headers.authorization", "body.password", "password"],
  // Use pino-pretty only in development
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname", // Keep terminal output clean
        },
      },
});

export default logger;
