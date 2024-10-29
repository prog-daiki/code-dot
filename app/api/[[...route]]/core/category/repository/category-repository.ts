import { db } from "@/db/drizzle";
import { Category } from "../types/category";
import { category } from "@/db/schema";
import { asc } from "drizzle-orm";
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
}
