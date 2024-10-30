import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { InferResponseType } from "hono";

type RequestType = Pick<Course, "title">;
type ResponseType = InferResponseType<
  (typeof client.api.courses)[":course_id"]["title"]["$put"]
>;

export const useUpdateCourseTitle = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].title.$put({
        param: { course_id: courseId },
        json,
      });
      if (!response.ok) {
        throw new Error("講座のタイトルの更新に失敗しました");
      }
      return await response.json();
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座のタイトルを更新しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: (error) => {
      toast.error("講座のタイトルの更新に失敗しました");
    },
  });
  return mutation;
};
