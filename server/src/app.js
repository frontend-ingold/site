import cors from "cors";
import express from "express";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    message: "Dress House API is running."
  });
});

app.use("/api", apiRouter);

export default app;
