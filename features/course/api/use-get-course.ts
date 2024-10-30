import { InferResponseType } from "hono";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.courses)[":course_id"]["$get"]
>;

export const useGetCourse = (
  courseId: string,
): UseQueryResult<ResponseType, Error> => {
  return useQuery<ResponseType, Error>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`講座取得に失敗しました: ${response.statusText}`);
      }

      return await response.json();
    },
  });
};
