import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type ResponseType = Chapter;

export const useDeleteChapter = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.courses[":course_id"].chapters[":chapter_id"].$delete({
        param: { course_id: courseId, chapter_id: chapterId },
      });
      if (!response.ok) {
        throw new Error("チャプターの削除に失敗しました");
      }
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId],
      });
      toast.success("チャプターを削除しました");
    },
    onError: () => {
      toast.error("チャプターの削除に失敗しました");
    },
  });
  return mutation;
};
