import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api.courses)["$get"]>;

export const useGetCourses = (): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await client.api.courses.$get();

      if (!response.ok) {
        throw new Error(`講座一覧取得に失敗しました: ${response.statusText}`);
      }

      return await response.json();
    },
  });
};
