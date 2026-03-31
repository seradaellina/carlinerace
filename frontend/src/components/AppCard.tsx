import { Link } from "react-router-dom";
import { TrackedApp } from "../types";

type AppCardProps = Readonly<{
  app: TrackedApp;
  isBusy: boolean;
  onToggle: (app: TrackedApp) => Promise<void>;
}>;

export function AppCard({ app, isBusy, onToggle }: AppCardProps) {
  return (
    <div className="card appItem">
      <div>
        <h3>{app.name}</h3>
        <p>{app.packageId}</p>
        <a href={app.playStoreUrl} target="_blank" rel="noreferrer">
          Open in Google Play
        </a>
      </div>
      <div className="actions">
        <button onClick={() => onToggle(app)} disabled={isBusy}>
          {app.isActive ? "Pause tracking" : "Resume tracking"}
        </button>
        <Link to={`/apps/${app.id}`}>Open timeline</Link>
      </div>
    </div>
  );
}
