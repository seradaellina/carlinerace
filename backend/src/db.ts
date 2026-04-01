import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Screenshot, TrackedApp } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "app-monitor.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS tracked_apps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  package_id TEXT NOT NULL,
  play_store_url TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id INTEGER NOT NULL,
  image_path TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES tracked_apps(id)
);
`);

const toTrackedApp = (row: any): TrackedApp => ({
  id: row.id,
  name: row.name,
  packageId: row.package_id,
  playStoreUrl: row.play_store_url,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const toScreenshot = (row: any): Screenshot => ({
  id: row.id,
  appId: row.app_id,
  imagePath: row.image_path,
  capturedAt: row.captured_at,
  createdAt: row.created_at
});

export const appRepo = {
  list(): TrackedApp[] {
    return db.prepare("SELECT * FROM tracked_apps ORDER BY created_at DESC").all().map(toTrackedApp);
  },
  listActive(): TrackedApp[] {
    return db
      .prepare("SELECT * FROM tracked_apps WHERE is_active = 1 ORDER BY created_at DESC")
      .all()
      .map(toTrackedApp);
  },
  getById(id: number): TrackedApp | null {
    const row = db.prepare("SELECT * FROM tracked_apps WHERE id = ?").get(id);
    return row ? toTrackedApp(row) : null;
  },
  getByPackageId(packageId: string): TrackedApp | null {
    const row = db.prepare("SELECT * FROM tracked_apps WHERE package_id = ?").get(packageId);
    return row ? toTrackedApp(row) : null;
  },
  create(input: { name: string; packageId: string; playStoreUrl: string }): TrackedApp {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO tracked_apps(name, package_id, play_store_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(input.name, input.packageId, input.playStoreUrl, now, now);
    return this.getById(Number(result.lastInsertRowid))!;
  },
  update(
    id: number,
    input: { name: string; packageId: string; playStoreUrl: string; isActive: boolean }
  ): TrackedApp | null {
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE tracked_apps SET name = ?, package_id = ?, play_store_url = ?, is_active = ?, updated_at = ? WHERE id = ?"
    ).run(input.name, input.packageId, input.playStoreUrl, Number(input.isActive), now, id);
    return this.getById(id);
  }
};

export const screenshotRepo = {
  listByAppId(appId: number): Screenshot[] {
    return db
      .prepare("SELECT * FROM screenshots WHERE app_id = ? ORDER BY captured_at DESC")
      .all(appId)
      .map(toScreenshot);
  },
  create(input: { appId: number; imagePath: string; capturedAt: string }): Screenshot {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      "INSERT INTO screenshots(app_id, image_path, captured_at, created_at) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(input.appId, input.imagePath, input.capturedAt, now);
    const row = db.prepare("SELECT * FROM screenshots WHERE id = ?").get(result.lastInsertRowid);
    return toScreenshot(row);
  }
};
