import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";

type RequestType = Pick<Course, "title">;
type ResponseType = Course;

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses.$post({
        json,
      });

      if (!response.ok) {
        throw new Error(`講座の作成に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: () => {
      toast.success("講座を作成しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error("講座の作成に失敗しました");
    },
  });
  return mutation;
};
