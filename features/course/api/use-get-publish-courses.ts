import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { PublishCourse } from "@/app/api/[[...route]]/core/course/types/publish-course";
import { client } from "@/lib/hono";

interface PublishCoursesParams {
  title: string;
  categoryId: string;
}

export const useGetPublishCourses = ({
  title,
  categoryId,
}: PublishCoursesParams): UseQueryResult<PublishCourse[], Error> => {
  return useQuery<PublishCourse[], Error>({
    queryKey: ["publish-courses", title, categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (categoryId) params.append("categoryId", categoryId);

      const response = await client.api.courses.publish.$get({
        query: Object.fromEntries(params),
      });

      if (!response.ok) {
        throw new Error(
          `公開講座一覧取得に失敗しました: ${response.statusText}`,
        );
      }

      const data: any[] = await response.json();
      const formattedData: PublishCourse[] = data.map((item) => ({
        ...item,
        course: {
          ...item.course,
          createDate: new Date(item.course.createDate),
          updateDate: new Date(item.course.updateDate),
        },
      }));
      return formattedData;
    },
  });
};
