import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const usePurchaseFreeCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[
        ":course_id"
      ].checkout_free.$post({
        param: { course_id: courseId },
      });
    },
    onSuccess: () => {
      toast.success("講座を購入しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => {
      toast.error("講座の購入に失敗しました");
    },
  });
  return mutation;
};
