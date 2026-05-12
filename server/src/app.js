import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();
const configuredOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (configuredOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      if (configuredOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  })
);
app.options("*", cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "Dress House API is running."
  });
});

app.use("/api", apiRouter);

export default app;
