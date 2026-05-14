import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { bookingsRouter } from "./routes/bookings.js";

dotenv.config();

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(
    new Set([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4173",
      "http://127.0.0.1:4173",
      "https://service-urbancare.vercel.app",
      ...configuredOrigins,
    ])
  );
}

const allowedOrigins = getAllowedOrigins();

function corsOrigin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS.`));
}

export const app = express();

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "UrbanCare API",
    health: "/api/health",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    ok: true,
    service: "UrbanCare API",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    allowedOrigins,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);

app.use((error, _req, res, _next) => {
  if (error?.message?.includes("not allowed by CORS")) {
    return res.status(403).json({ message: error.message });
  }

  console.error("Unhandled server error.", error);
  return res.status(500).json({ message: "Internal server error." });
});

export { allowedOrigins };
