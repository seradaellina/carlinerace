import { TrackedApp } from "../../types";
import { apiUrl, parseResponse } from "../client";

export function listAppsRequest(): Promise<TrackedApp[]> {
  return fetch(apiUrl("/api/apps")).then((response) =>
    parseResponse<TrackedApp[]>(response)
  );
}
