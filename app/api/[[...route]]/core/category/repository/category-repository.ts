import { db } from "@/db/drizzle";
import { Category } from "../types/category";
import { category } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

/**
 * カテゴリーのリポジトリを管理するクラス
 */
export class CategoryRepository {
  /**
   * 全てのカテゴリーをカテゴリー名の昇順で取得する
   * @returns {Promise<Category[]>} カテゴリー一覧
   */
  async getCategories(): Promise<Category[]> {
    const data: Category[] = await db
      .select()
      .from(category)
      .orderBy(asc(category.name));
    return data;
  }

  /**
   * カテゴリーを登録する
   * @param name カテゴリーの名前
   * @returns {Promise<Category>} 登録したカテゴリー
   */
  async registerCategory(name: string): Promise<Category> {
    const [data]: Category[] = await db
      .insert(category)
      .values({
        id: createId(),
        name,
      })
      .returning();
    return data;
  }

  /**
   * カテゴリーをIDで取得する
   * @param id カテゴリーのID
   * @returns {Promise<Category | null>} カテゴリー
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const [data]: Category[] = await db
      .select()
      .from(category)
      .where(eq(category.id, id));
    return data;
  }

  /**
   * カテゴリーが存在するかを確認する
   * @param id カテゴリーのID
   * @returns {Promise<boolean>} カテゴリーが存在するかどうか
   */
  async isCategoryExists(id: string): Promise<boolean> {
    const category: Category | null = await this.getCategoryById(id);
    return !!category;
  }

  /**
   * カテゴリーを更新する
   * @param categoryId カテゴリーID
   * @param updateData 更新するデータ
   * @returns {Promise<Category>} 更新したカテゴリー
   */
  async updateCategory(
    categoryId: string,
    updateData: Partial<Omit<typeof category.$inferInsert, "id">>,
  ): Promise<Category> {
    const [data]: Category[] = await db
      .update(category)
      .set({ ...updateData })
      .where(eq(category.id, categoryId))
      .returning();
    return data;
  }

  /**
   * カテゴリーを削除する
   * @param categoryId カテゴリーID
   * @returns {Promise<Category>} 削除したカテゴリー
   */
  async deleteCategory(categoryId: string): Promise<Category> {
    const [data]: Category[] = await db
      .delete(category)
      .where(eq(category.id, categoryId))
      .returning();
    return data;
  }
}
