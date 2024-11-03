import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";

type RequestType = Pick<Course, "categoryId">;
type ResponseType = Course;

export const useUpdateCourseCategory = (courseId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].category.$put({
        param: { course_id: courseId },
        json: { categoryId: json.categoryId ?? "" },
      });
      if (!response.ok) {
        throw new Error("講座のカテゴリの更新に失敗しました");
      }
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座のカテゴリを更新しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: () => {
      toast.error("講座のカテゴリの更新に失敗しました");
    },
  });
  return mutation;
};
