import { TrackedApp } from "../../types";
import { apiUrl, parseResponse } from "../client";

export type CreateAppInput = Readonly<{
  name: string;
  playStoreUrl: string;
}>;

export function createAppRequest(input: CreateAppInput): Promise<TrackedApp> {
  return fetch(apiUrl("/api/apps"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  }).then((response) => parseResponse<TrackedApp>(response));
}
