import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type RequestType = Pick<Chapter, "title">;
type ResponseType = Chapter;

export const useCreateChapter = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].chapters.$post({
        param: { course_id: courseId },
        json,
      });

      if (!response.ok) {
        throw new Error(`チャプターの作成に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: () => {
      toast.success("チャプターを作成しました");
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
    onError: (error) => {
      toast.error("チャプターの作成に失敗しました");
    },
  });
  return mutation;
};
