import { PurchaseCourse } from "@/app/api/[[...route]]/core/course/types/purchase-course";
import { client } from "@/lib/hono";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetPurchaseCourses = (): UseQueryResult<
  PurchaseCourse[],
  Error
> => {
  return useQuery<PurchaseCourse[], Error>({
    queryKey: ["purchase-courses"],
    queryFn: async () => {
      const response = await client.api.courses.purchased.$get();

      if (!response.ok) {
        throw new Error(`購入講座取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      const purchaseCourses: PurchaseCourse[] = data.map((item) => ({
        ...item,
        course: {
          ...item.course,
          createDate: new Date(item.course.createDate),
          updateDate: new Date(item.course.updateDate),
        },
        chapters: item.chapters.map((chapter) => ({
          ...chapter,
          createDate: new Date(chapter.createDate),
          updateDate: new Date(chapter.updateDate),
        })),
      }));
      return purchaseCourses;
    },
  });
};
