import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";

type ResponseType = Chapter[];

export const useGetChapters = (courseId: string): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].chapters.$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`チャプターの一覧取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((chapter: Chapter) => ({
        ...chapter,
        createDate: new Date(chapter.createDate),
        updateDate: new Date(chapter.updateDate),
      }));
    },
  });
};
