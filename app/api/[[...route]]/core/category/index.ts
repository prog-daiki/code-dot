import { Hono } from "hono";
import { validateAuthMiddleware } from "../../auth/validate-auth-middleware";
import type { Category } from "./types/category";
import { CategoryUseCase } from "./usecase/category-usecase";
import { HandleError } from "../../error/handle-error";

const Category = new Hono<{
  Variables: {
    categoryUseCase: CategoryUseCase;
  };
}>().use("*", async (c, next) => {
  c.set("categoryUseCase", new CategoryUseCase());
  await next();
});

/**
 * カテゴリー一覧取得API
 * @route GET /api/categories
 * @middleware validateAuthMiddleware - 認証ユーザーの検証
 * @returns カテゴリー一覧
 * @throws カテゴリー一覧取得エラー
 */
Category.get("/", validateAuthMiddleware, async (c) => {
  const categoryUseCase = c.get("categoryUseCase");
  try {
    const categories: Category[] = await categoryUseCase.getCategories();
    return c.json(categories);
  } catch (error) {
    return HandleError(c, error, "カテゴリー一覧取得エラー");
  }
});

export default Category;
