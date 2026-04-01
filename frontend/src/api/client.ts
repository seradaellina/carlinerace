const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    let message = text || `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) {
        message = parsed.error;
      }
    } catch {
      // Keep text fallback for non-JSON responses.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
