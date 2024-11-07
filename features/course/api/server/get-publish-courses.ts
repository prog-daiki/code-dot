import { auth } from "@clerk/nextjs/server";

import { PublishCourse } from "@/app/api/[[...route]]/core/course/types/publish-course";

type ResponseType = PublishCourse[];

export const getPublishCourses = async (title: string, categoryId: string): Promise<ResponseType> => {
  const { getToken } = await auth();
  const token = await getToken();
  const queryParams = new URLSearchParams();
  if (title && title.length > 0) queryParams.set("title", title);
  if (categoryId && categoryId.length > 0) queryParams.set("categoryId", categoryId);
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/publish?${queryParams.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`公開講座一覧取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
};
