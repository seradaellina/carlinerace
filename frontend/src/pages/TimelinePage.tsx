import { useNavigate, useParams } from "react-router-dom";
import { ScreenshotCard } from "../components/ScreenshotCard";
import { useCaptureNowMutation } from "../api/hooks/useCaptureNowMutation";
import { useScreenshotsQuery } from "../api/hooks/useScreenshotsQuery";

export function TimelinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appId = Number(id);
  const screenshotsQuery = useScreenshotsQuery(appId);
  const captureNowMutation = useCaptureNowMutation(appId);

  const ordered = screenshotsQuery.data?.screenshots ?? [];

  const handleBackClick = () => {
    navigate("/");
  };

  const handleCaptureNowClick = async () => {
    await captureNowMutation.mutateAsync();
  };

  const handleRefreshClick = () => {
    void screenshotsQuery.refetch();
  };

  const loading = screenshotsQuery.isFetching || captureNowMutation.isPending;
  const app = screenshotsQuery.data?.app;

  const getErrorMessage = (): string => {
    if (screenshotsQuery.error instanceof Error) {
      return screenshotsQuery.error.message;
    }
    if (captureNowMutation.error instanceof Error) {
      return captureNowMutation.error.message;
    }
    return "";
  };

  const error = getErrorMessage();

  return (
    <div className="page">
      <button onClick={handleBackClick}>Back</button>
      <h1>{app?.name || "Monitoring timeline"}</h1>
      <p className="subtitle">{app?.playStoreUrl}</p>
      <div className="row">
        <button onClick={handleCaptureNowClick} disabled={loading}>
          {captureNowMutation.isPending ? "Capturing..." : "Capture now"}
        </button>
        <button onClick={handleRefreshClick} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {!ordered.length && !loading && (
        <p>No screenshots yet. Trigger manual capture or wait for cron run.</p>
      )}

      <div className="timeline">
        {ordered.map((shot) => (
          <ScreenshotCard key={shot.id} screenshot={shot} />
        ))}
      </div>
    </div>
  );
}
