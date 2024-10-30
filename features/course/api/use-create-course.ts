import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";
import { Course } from "@/app/api/[[...route]]/core/course/types/course";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.courses.$post>;
type RequestType = InferRequestType<typeof client.api.courses.$post>["json"];

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.courses.$post({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("講座を作成しました");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error("講座の作成に失敗しました");
    },
  });
  return mutation;
};
