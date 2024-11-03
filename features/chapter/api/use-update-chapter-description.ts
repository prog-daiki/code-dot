import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type RequestType = Pick<Chapter, "description">;
type ResponseType = Chapter;

export const useUpdateChapterDescription = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].chapters[":chapter_id"].description.$put({
        param: { course_id: courseId, chapter_id: chapterId },
        json: { description: json.description ?? "" },
      });
      if (!response.ok) {
        throw new Error("チャプターの詳細の更新に失敗しました");
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
      toast.success("チャプターの詳細を更新しました");
    },
    onError: () => {
      toast.error("チャプターの詳細の更新に失敗しました");
    },
  });
  return mutation;
};
