import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { captureNowRequest } from "../requests/captureNow";

export function useCaptureNowMutation(appId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => captureNowRequest(appId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.screenshots(appId) });
    }
  });
}
