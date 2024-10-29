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
}
