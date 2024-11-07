import { auth } from "@clerk/nextjs/server";

import { PublishCourseWithMuxData } from "@/app/api/[[...route]]/core/course/types/publish-course-with-muxdata";

type ResponseType = PublishCourseWithMuxData;

export const getPublishCourse = async (courseId: string): Promise<ResponseType> => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/publish`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`公開講座取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
};
