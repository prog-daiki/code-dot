import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Category } from "@/app/api/[[...route]]/core/category/types/category";

export const useGetCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error(
          `カテゴリーの一覧取得に失敗しました: ${response.statusText}`,
        );
      }

      const data: Category[] = await response.json();
      return data;
    },
  });
};
