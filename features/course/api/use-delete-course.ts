import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { toast } from "sonner";

type ResponseType = Course;

export const useDeleteCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[":course_id"].$delete({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`講座の削除に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
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
