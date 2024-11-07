import { Category } from "@/app/api/[[...route]]/core/category/types/category";
import { auth } from "@clerk/nextjs/server";

type ResponseType = Category[];

export const getCategories = async (): Promise<ResponseType> => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`カテゴリーの一覧取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
};
