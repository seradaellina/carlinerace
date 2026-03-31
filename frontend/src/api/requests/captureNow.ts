import { apiUrl, parseResponse } from "../client";

export type CaptureNowResponse = Readonly<{ ok: boolean }>;

export function captureNowRequest(appId: number): Promise<CaptureNowResponse> {
  return fetch(apiUrl(`/api/apps/${appId}/capture`), { method: "POST" }).then(
    (response) => parseResponse<CaptureNowResponse>(response)
  );
}
