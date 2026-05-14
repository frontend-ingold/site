import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { ensureDatabase } from "./db/initDb.js";
import { authRouter } from "./routes/auth.js";
import { bookingsRouter } from "./routes/bookings.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);

try {
  await ensureDatabase();
  const server = app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Change PORT in server/.env or stop the process using that port.`
      );
      process.exit(1);
    }

    console.error("Server error.", error);
    process.exit(1);
  });
} catch (error) {
  console.error("Server startup failed.", error);
  process.exit(1);
}
