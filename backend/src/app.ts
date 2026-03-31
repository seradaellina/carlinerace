import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appsRouter } from "./routes/apps.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    "/screenshots",
    express.static(path.join(__dirname, "..", "screenshots"))
  );

  app.use("/api/apps", appsRouter);

  return app;
}
