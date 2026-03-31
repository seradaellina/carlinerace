import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getScreenshotsRequest } from "../requests/getScreenshots";

export function useScreenshotsQuery(appId: number) {
  return useQuery({
    queryKey: queryKeys.screenshots(appId),
    queryFn: () => getScreenshotsRequest(appId),
    enabled: !Number.isNaN(appId)
  });
}
