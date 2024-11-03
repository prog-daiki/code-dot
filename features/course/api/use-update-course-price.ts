import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";

type RequestType = Pick<Course, "price">;
type ResponseType = Course;

export const useUpdateCoursePrice = (courseId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].price.$put({
        param: { course_id: courseId },
        json: { price: json.price ?? 0 },
      });
      if (!response.ok) {
        throw new Error("講座の価格の更新に失敗しました");
      }
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座の価格を更新しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: () => {
      toast.error("講座の価格の更新に失敗しました");
    },
  });
  return mutation;
};
