import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { validateAuthMiddleware } from "../../auth/validate-auth-middleware";
import type { Category } from "./types/category";
import { CategoryUseCase } from "./usecase/category-usecase";
import { HandleError } from "../../error/handle-error";
import { insertCategorySchema } from "@/db/schema";
import { validateAdminMiddleware } from "../../auth/validate-admin-middleware";

const Category = new Hono<{
  Variables: {
    categoryUseCase: CategoryUseCase;
  };
}>()
  .use("*", async (c, next) => {
    c.set("categoryUseCase", new CategoryUseCase());
    await next();
  })
  /**
   * カテゴリー一覧取得API
   * @route GET /api/categories
   * @middleware validateAuthMiddleware - 認証ユーザーの検証
   * @returns カテゴリー一覧
   * @throws カテゴリー一覧取得エラー
   */
  .get("/", validateAuthMiddleware, async (c) => {
    const categoryUseCase = c.get("categoryUseCase");
    try {
      const categories: Category[] = await categoryUseCase.getCategories();
      return c.json(categories);
    } catch (error) {
      return HandleError(c, error, "カテゴリー一覧取得エラー");
    }
  })

  /**
   * カテゴリー登録API
   * @route POST /api/categories
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns 登録したカテゴリー
   * @throws カテゴリー登録エラー
   */
  .post(
    "/",
    validateAdminMiddleware,
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const validatedData = c.req.valid("json");
      const categoryUseCase = c.get("categoryUseCase");
      try {
        const category: Category = await categoryUseCase.registerCategory(
          validatedData.name,
        );
        return c.json(category);
      } catch (error) {
        return HandleError(c, error, "カテゴリー登録エラー");
      }
    },
  );

export default Category;
