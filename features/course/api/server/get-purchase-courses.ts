import { auth } from "@clerk/nextjs/server";

import { PurchaseCourse } from "@/app/api/[[...route]]/core/course/types/purchase-course";

type ResponseType = PurchaseCourse[];

export const getPurchaseCourses = async (): Promise<ResponseType> => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/purchased`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`購入講座一覧取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
};
