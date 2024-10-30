import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";
import { client } from "@/lib/hono";

export const useGetChapters = (
  courseId: string,
): UseQueryResult<Chapter[], Error> => {
  return useQuery<Chapter[], Error>({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].chapters.$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(
          `チャプターの一覧取得に失敗しました: ${response.statusText}`,
        );
      }

      const data = await response.json();
      const chapters: Chapter[] = data.map((chapter) => ({
        ...chapter,
        createDate: new Date(chapter.createDate),
        updateDate: new Date(chapter.updateDate),
      }));
      return chapters;
    },
  });
};
