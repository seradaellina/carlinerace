import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { listAppsRequest } from "../requests/listApps";

export function useAppsQuery() {
  return useQuery({
    queryKey: queryKeys.apps,
    queryFn: listAppsRequest
  });
}
