import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";

type RequestType = Pick<Course, "title">;
type ResponseType = Course;

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
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
      toast.success("講座のタイトルを更新しました");
    },
    onError: () => {
      toast.error("講座のタイトルの更新に失敗しました");
    },
  });
  return mutation;
};
