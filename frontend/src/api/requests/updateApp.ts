import { TrackedApp } from "../../types";
import { apiUrl, parseResponse } from "../client";

export type UpdateAppInput = Readonly<{
  id: number;
  data: {
    name: string;
    playStoreUrl: string;
    isActive: boolean;
  };
}>;

export function updateAppRequest(input: UpdateAppInput): Promise<TrackedApp> {
  return fetch(apiUrl(`/api/apps/${input.id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input.data)
  }).then((response) => parseResponse<TrackedApp>(response));
}
