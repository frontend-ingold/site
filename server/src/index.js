import dotenv from "dotenv";
import { app } from "./app.js";
import { ensureDatabase } from "./db/initDb.js";

dotenv.config();

const port = Number(process.env.PORT || 4001);

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
