import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { ChapterWithMuxData } from "@/app/api/[[...route]]/core/chapter/types/chapter-with-muxdata";

type ResponseType = ChapterWithMuxData;

export const useGetChapter = (courseId: string, chapterId: string): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["chapter", courseId, chapterId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].chapters[":chapter_id"].$get({
        param: { course_id: courseId, chapter_id: chapterId },
      });

      if (!response.ok) {
        throw new Error(`講座取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        chapter: {
          ...data.chapter,
          createDate: new Date(data.chapter.createDate),
          updateDate: new Date(data.chapter.updateDate),
        },
      };
    },
  });
};
