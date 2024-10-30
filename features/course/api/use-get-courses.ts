import { client } from "@/lib/hono";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { AdminCourse } from "@/app/api/[[...route]]/core/course/types/admin-course";

export const useGetCourses = (): UseQueryResult<AdminCourse[], Error> => {
  return useQuery<AdminCourse[], Error>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await client.api.courses.$get();

      if (!response.ok) {
        throw new Error(`講座一覧取得に失敗しました: ${response.statusText}`);
      }

      const data: any[] = await response.json();
      const formattedData: AdminCourse[] = data.map((item) => ({
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
