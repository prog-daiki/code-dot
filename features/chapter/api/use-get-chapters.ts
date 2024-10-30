import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.courses)[":course_id"]["chapters"]["$get"]
>;

export const useGetChapters = (
  courseId: string,
): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
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

      return await response.json();
    },
  });
};
