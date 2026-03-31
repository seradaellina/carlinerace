import cron from "node-cron";
import { appRepo } from "./db.js";
import { captureAppListing } from "./capture.js";

let running = false;

export function startScheduler() {
  const cronExpr = process.env.CAPTURE_CRON ?? "*/30 * * * *";

  cron.schedule(cronExpr, async () => {
    if (running) {
      return;
    }
    running = true;
    try {
      const apps = appRepo.listActive();
      for (const app of apps) {
        try {
          await captureAppListing(app);
        } catch (error) {
          console.error(`Capture failed for app ${app.id}`, error);
        }
      }
    } finally {
      running = false;
    }
  });

  console.log(`Capture scheduler started with cron: ${cronExpr}`);
}
