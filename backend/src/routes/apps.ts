import { Router } from "express";
import { captureAppListing, defaultPlayStoreUrl, extractPackageId } from "../capture.js";
import { appRepo, screenshotRepo } from "../db.js";

type CreateAppBody = Readonly<{
  playStoreUrl: string;
  name?: string;
}>;

type UpdateAppBody = Readonly<{
  playStoreUrl: string;
  name?: string;
  isActive?: boolean;
}>;

export const appsRouter = Router();

const parseAppId = (idParam: string): number | null => {
  const id = Number(idParam);
  return Number.isNaN(id) ? null : id;
};

appsRouter.get("/", (_req, res) => {
  res.json(appRepo.list());
});

appsRouter.post("/", (req, res) => {
  const { playStoreUrl, name } = req.body as CreateAppBody;
  const packageId = extractPackageId(playStoreUrl);
  if (!packageId) {
    return res.status(400).json({ error: "Invalid Google Play URL" });
  }

  const created = appRepo.create({
    name: name?.trim() || packageId,
    packageId,
    playStoreUrl: defaultPlayStoreUrl(packageId)
  });
  return res.status(201).json(created);
});

appsRouter.put("/:id", (req, res) => {
  const id = parseAppId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid app id" });
  }

  const current = appRepo.getById(id);
  if (!current) {
    return res.status(404).json({ error: "App not found" });
  }

  const { playStoreUrl, name, isActive } = req.body as UpdateAppBody;
  const packageId = extractPackageId(playStoreUrl);
  if (!packageId) {
    return res.status(400).json({ error: "Invalid Google Play URL" });
  }

  const updated = appRepo.update(id, {
    name: (name || current.name).trim(),
    packageId,
    playStoreUrl: defaultPlayStoreUrl(packageId),
    isActive: isActive === undefined ? current.isActive : Number(isActive)
  });
  return res.json(updated);
});

appsRouter.get("/:id/screenshots", (req, res) => {
  const id = parseAppId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid app id" });
  }

  const appItem = appRepo.getById(id);
  if (!appItem) {
    return res.status(404).json({ error: "App not found" });
  }

  return res.json({
    app: appItem,
    screenshots: screenshotRepo.listByAppId(id)
  });
});

appsRouter.post("/:id/capture", async (req, res) => {
  const id = parseAppId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid app id" });
  }

  const appItem = appRepo.getById(id);
  if (!appItem) {
    return res.status(404).json({ error: "App not found" });
  }

  await captureAppListing(appItem);
  return res.status(202).json({ ok: true });
});
