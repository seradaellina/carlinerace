import { FormEvent, useEffect, useState } from "react";
import { TrackedApp } from "../types";
import { AppCard } from "../components/AppCard";
import { useAppsQuery } from "../api/hooks/useAppsQuery";
import { useCreateAppMutation } from "../api/hooks/useCreateAppMutation";
import { useUpdateAppMutation } from "../api/hooks/useUpdateAppMutation";

export function AppsPage() {
  const [name, setName] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [error, setError] = useState("");

  const appsQuery = useAppsQuery();
  const createAppMutation = useCreateAppMutation();
  const updateAppMutation = useUpdateAppMutation();

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createAppMutation.mutateAsync({ name, playStoreUrl });
      setName("");
      setPlayStoreUrl("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create app";
      setError(message);
    }
  };

  const onToggle = async (app: TrackedApp) => {
    try {
      await updateAppMutation.mutateAsync({
        id: app.id,
        data: {
          name: app.name,
          playStoreUrl: app.playStoreUrl,
          isActive: !app.isActive,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update app";
      setError(message);
    }
  };

  useEffect(() => {
    if (appsQuery.error) {
      setError(
        appsQuery.error instanceof Error
          ? appsQuery.error.message
          : "Failed to load apps"
      );
    }
  }, [appsQuery.error]);

  return (
    <div className="page">
      <h1>Android App Monitoring</h1>
      <p className="subtitle">Track Google Play listing changes over time.</p>

      <form onSubmit={onCreate} className="card form">
        <h2>Add app</h2>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name (e.g. Call of Duty)"
        />
        <input
          required
          value={playStoreUrl}
          onChange={(e) => setPlayStoreUrl(e.target.value)}
          placeholder="https://play.google.com/store/apps/details?id=com.example"
        />
        <button type="submit">Add app</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="list">
        {(appsQuery.data ?? []).map((app) => (
          <AppCard
            key={app.id}
            app={app}
            isBusy={
              updateAppMutation.isPending &&
              updateAppMutation.variables?.id === app.id
            }
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
