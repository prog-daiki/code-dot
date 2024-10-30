import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

type ResponseType = Course;

export const useUpdateCourseUnpublish = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[":course_id"].unpublish.$put({
        param: { course_id: courseId },
      });
      if (!response.ok) {
        throw new Error("講座の非公開に失敗しました");
      }
      const data = await response.json();
      const course = {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
      return course;
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座を非公開にしました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: (error) => {
      toast.error("講座の非公開に失敗しました");
    },
  });
  return mutation;
};
