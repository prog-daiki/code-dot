import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type RequestType = Pick<Chapter, "videoUrl">;
type ResponseType = Chapter;

export const useUpdateChapterVideo = (courseId: string, chapterId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses[":course_id"].chapters[":chapter_id"].video.$put({
        param: { course_id: courseId, chapter_id: chapterId },
        json: { videoUrl: json.videoUrl ?? "" },
      });
      if (!response.ok) {
        throw new Error("チャプターの動画の更新に失敗しました");
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
      toast.success("チャプターの動画を更新しました");
    },
    onError: () => {
      toast.error("チャプターの動画の更新に失敗しました");
    },
  });
  return mutation;
};
