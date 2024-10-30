import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { client } from "@/lib/hono";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetCourse = (
  courseId: string,
): UseQueryResult<Course, Error> => {
  return useQuery<Course, Error>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`講座取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      const course: Course = {
        ...data,
        createDate: new Date(data.createDate),
        updateDate: new Date(data.updateDate),
      };
      return course;
    },
  });
};
