import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.courses)[":course_id"]["$delete"]
>;

export const useDeleteCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[":course_id"].$delete({
        param: { course_id: courseId },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("講座を削除しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error("講座の削除に失敗しました");
    },
  });
  return mutation;
};
