import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";

type ResponseType = Course;

export const useGetCourse = (courseId: string): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`講座取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
    },
  });
};
