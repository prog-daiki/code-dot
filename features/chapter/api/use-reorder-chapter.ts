import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

type RequestType = {
  list: { id: string; position: number }[];
};

type ResponseType = {
  status: number;
  error?: string;
};

export const useReorderChapter = (courseId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType["list"]>({
    mutationFn: async (chapters) => {
      const response = await client.api.courses[":course_id"].chapters.reorder.$put({
        param: { course_id: courseId },
        json: { list: chapters },
      });
      return { status: response.status };
    },
    onSuccess: (updatedChapters) => {
      toast.success("チャプターの順番を更新しました");
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
    onError: (error) => {
      toast.error("チャプターの順番の更新に失敗しました");
    },
  });
  return mutation;
};
