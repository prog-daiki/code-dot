import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type RequestType = Pick<Chapter, "title">;
type ResponseType = Chapter;

export const useUpdateChapterTitle = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].chapters[":chapter_id"].title.$put({
        param: { course_id: courseId, chapter_id: chapterId },
        json,
      });
      if (!response.ok) {
        throw new Error("チャプターのタイトルの更新に失敗しました");
      }
      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
    onSuccess: (updatedChapter) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", courseId, chapterId],
      });
      queryClient.setQueryData(["chapter", chapterId], updatedChapter);
      toast.success("チャプターのタイトルを更新しました");
    },
    onError: (error) => {
      toast.error("チャプターのタイトルの更新に失敗しました");
    },
  });
  return mutation;
};
