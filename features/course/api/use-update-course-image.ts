import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

type RequestType = Pick<Course, "imageUrl">;
type ResponseType = Course;

export const useUpdateCourseImage = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].thumbnail.$put({
        param: { course_id: courseId },
        json: { imageUrl: json.imageUrl ?? "" },
      });
      if (!response.ok) {
        throw new Error("講座のサムネイルの更新に失敗しました");
      }
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: (updatedCourse) => {
      toast.success("講座のサムネイルを更新しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.setQueryData(["course", courseId], updatedCourse);
    },
    onError: () => {
      toast.error("講座のサムネイルの更新に失敗しました");
    },
  });
  return mutation;
};
