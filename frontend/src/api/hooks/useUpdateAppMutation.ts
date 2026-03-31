import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { updateAppRequest } from "../requests/updateApp";

export function useUpdateAppMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.apps });
    }
  });
}
