import { apiUrl } from "../api/client";
import { Screenshot } from "../types";
import { formatDate } from "../utils/date";

type ScreenshotCardProps = Readonly<{
  screenshot: Screenshot;
}>;

export function ScreenshotCard({ screenshot }: ScreenshotCardProps) {
  return (
    <article className="card">
      <h3>Screenshot time: {formatDate(screenshot.capturedAt)}</h3>
      <img src={apiUrl(screenshot.imagePath)} alt={`Screenshot ${screenshot.id}`} />
    </article>
  );
}
