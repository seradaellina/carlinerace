export const queryKeys = {
  apps: ["apps"] as const,
  screenshots: (appId: number) => ["screenshots", appId] as const
};
