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
const configuredFrontend = (process.env.FRONTEND_URL ?? "").trim().replace(/\.+$|\/+$/g, "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., server-to-server, curl) that have no origin
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\.+$|\/+$/g, "");
      if (normalizedOrigin === configuredFrontend) {
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
