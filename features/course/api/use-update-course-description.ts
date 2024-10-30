import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

type RequestType = InferRequestType<(typeof client.api.courses)[":course_id"]["description"]["$put"]>["json"];
type ResponseType = InferResponseType<(typeof client.api.courses)[":course_id"]["description"]["$put"]>;

export const useUpdateCourseDescription = (courseId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].description.$put({
        param: { course_id: courseId },
        json: { description: json.description },
      });
      if (!response.ok) {
        throw new Error("講座の詳細の更新に失敗しました");
      }
      return await response.json();
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座の詳細を更新しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: (error) => {
      toast.error("講座の詳細の更新に失敗しました");
    },
  });
  return mutation;
};
