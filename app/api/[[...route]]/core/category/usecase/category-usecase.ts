import { CategoryNotFoundError } from "../../../error/category-not-found-error";
import { CategoryRepository } from "../repository/category-repository";
import { Category } from "../types/category";

/**
 * カテゴリーに関するユースケースを管理するクラス
 */
export class CategoryUseCase {
  private categoryRepository: CategoryRepository;
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * カテゴリーを一覧取得する
   * @returns カテゴリー一覧
   */
  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.getCategories();
  }

  /**
   * カテゴリーを登録する
   * @param name カテゴリーの名前
   * @returns 登録したカテゴリー
   */
  async registerCategory(name: string): Promise<Category> {
    return await this.categoryRepository.registerCategory(name);
  }

  /**
   * カテゴリー名を編集する
   * @param categoryId カテゴリーID
   * @param name カテゴリー名
   * @returns 更新したカテゴリー
   */
  async updateCategoryName(
    categoryId: string,
    name: string,
  ): Promise<Category> {
    // カテゴリーの存在チェック
    const isCategoryExists: boolean =
      await this.categoryRepository.isCategoryExists(categoryId);
    if (!isCategoryExists) {
      throw new CategoryNotFoundError();
    }

    return await this.categoryRepository.updateCategory(categoryId, { name });
  }
}
