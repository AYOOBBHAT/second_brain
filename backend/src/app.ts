import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./routes/auth";
import contentRouter from "./routes/content";
import cookieParser from "cookie-parser";
import cors from "cors";
import brainRouter from "./routes/brain";

const app = express();

// Normalize the configured frontend URL so trailing slashes/dots don't accidentally break CORS
function normalizeOriginValue(s: string) {
  return s.trim().replace(/\.+$|\/+$/g, "");
}

const configuredFrontend = normalizeOriginValue(process.env.FRONTEND_URL ?? "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., server-to-server, curl) that have no origin
      if (!origin) return callback(null, true);
      const normalizedOrigin = normalizeOriginValue(origin);

      // compare without protocol prefix as some clients include it differently
      const originNoProto = normalizedOrigin.replace(/^https?:\/\//, "");
      const configuredNoProto = configuredFrontend.replace(/^https?:\/\//, "");

      if (normalizedOrigin === configuredFrontend || originNoProto === configuredNoProto) {
        // allowed
        return callback(null, true);
      }

      console.warn(
        `CORS blocked request from origin: ${origin} (normalized: ${normalizedOrigin}), expected: ${configuredFrontend}`
      );
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", brainRouter);

export default app;
