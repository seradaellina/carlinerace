import { Screenshot, TrackedApp } from "../../types";
import { apiUrl, parseResponse } from "../client";

export type GetScreenshotsResponse = Readonly<{
  app: TrackedApp;
  screenshots: Screenshot[];
}>;

export function getScreenshotsRequest(appId: number): Promise<GetScreenshotsResponse> {
  return fetch(apiUrl(`/api/apps/${appId}/screenshots`)).then((response) =>
    parseResponse<GetScreenshotsResponse>(response)
  );
}
