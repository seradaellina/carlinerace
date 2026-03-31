import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { createAppRequest } from "../requests/createApp";

export function useCreateAppMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.apps });
    }
  });
}
