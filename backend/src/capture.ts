import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { screenshotRepo } from "./db.js";
import { TrackedApp } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotDir = path.join(__dirname, "..", "screenshots");

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

export const extractPackageId = (playStoreUrl: string): string | null => {
  try {
    const url = new URL(playStoreUrl);
    if (!url.hostname.includes("play.google.com")) {
      return null;
    }
    return url.searchParams.get("id");
  } catch {
    return null;
  }
};

export const defaultPlayStoreUrl = (packageId: string): string =>
  `https://play.google.com/store/apps/details?id=${packageId}`;

export async function captureAppListing(app: TrackedApp): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 2400 }
  });

  const page = await context.newPage();
  await page.goto(app.playStoreUrl, { waitUntil: "networkidle", timeout: 120000 });

  // Dismiss consent dialogs if present (best effort).
  const consentButtons = [
    "button:has-text('I agree')",
    "button:has-text('Accept all')",
    "button:has-text('Accept')"
  ];
  for (const selector of consentButtons) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => undefined);
      break;
    }
  }

  await page.waitForTimeout(2500);
  const fileName = `${app.id}-${Date.now()}.png`;
  const absoluteImagePath = path.join(screenshotDir, fileName);
  await page.screenshot({ path: absoluteImagePath, fullPage: true });

  await context.close();
  await browser.close();

  screenshotRepo.create({
    appId: app.id,
    imagePath: `/screenshots/${fileName}`,
    capturedAt: new Date().toISOString()
  });
}
