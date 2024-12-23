import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { validateAuthMiddleware } from "../../auth/validate-auth-middleware";
import type { Category } from "./types/category";
import { CategoryUseCase } from "./usecase/category-usecase";
import { HandleError } from "../../error/handle-error";
import { insertCategorySchema } from "@/db/schema";
import { validateAdminMiddleware } from "../../auth/validate-admin-middleware";
import { Messages } from "../../common/message";
import { CategoryNotFoundError } from "../../error/category-not-found-error";

const CategoryController = new Hono<{
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
  .post("/", validateAdminMiddleware, zValidator("json", insertCategorySchema.pick({ name: true })), async (c) => {
    const validatedData = c.req.valid("json");
    const categoryUseCase = c.get("categoryUseCase");
    try {
      const category: Category = await categoryUseCase.registerCategory(validatedData.name);
      return c.json(category);
    } catch (error) {
      return HandleError(c, error, "カテゴリー登録エラー");
    }
  })

  /**
   * カテゴリー編集API
   * @route PUT /api/categories/:category_id
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns 更新したカテゴリー
   * @throws CategoryNotFoundError
   * @throws カテゴリー編集エラー
   */
  .put(
    "/:category_id",
    validateAdminMiddleware,
    zValidator("param", z.object({ category_id: z.string() })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const validatedData = c.req.valid("json");
      const { category_id: categoryId } = c.req.valid("param");
      const categoryUseCase = c.get("categoryUseCase");
      try {
        const category: Category = await categoryUseCase.updateCategoryName(categoryId, validatedData.name);
        return c.json(category);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          console.error(`存在しないカテゴリーです: ID ${categoryId}`);
          return c.json({ error: Messages.MSG_ERR_003("CATEGORY") }, 404);
        }
        return HandleError(c, error, "カテゴリー編集エラー");
      }
    },
  )

  /**
   * カテゴリー削除API
   * @route DELETE /api/categories/:category_id
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns 削除したカテゴリー
   * @throws CategoryNotFoundError
   * @throws カテゴリー削除エラー
   */
  .delete(
    "/:category_id",
    validateAdminMiddleware,
    zValidator("param", z.object({ category_id: z.string() })),
    async (c) => {
      const { category_id: categoryId } = c.req.valid("param");
      const categoryUseCase = c.get("categoryUseCase");
      try {
        const category: Category = await categoryUseCase.deleteCategory(categoryId);
        return c.json(category);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          console.error(`存在しないカテゴリーです: ID ${categoryId}`);
          return c.json({ error: Messages.MSG_ERR_003("CATEGORY") }, 404);
        }
        return HandleError(c, error, "カテゴリー削除エラー");
      }
    },
  );

export default CategoryController;
