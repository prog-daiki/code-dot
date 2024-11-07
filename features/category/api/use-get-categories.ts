import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { Category } from "@/app/api/[[...route]]/core/category/types/category";
import { client } from "@/lib/hono";

type ResponseType = Category[];

export const useGetCategories = (): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error(`カテゴリーの一覧取得に失敗しました: ${response.statusText}`);
      }

      return response.json();
    },
  });
};
