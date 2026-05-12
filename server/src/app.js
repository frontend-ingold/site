import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "Dress House API is running."
  });
});

app.use("/api", apiRouter);

export default app;
