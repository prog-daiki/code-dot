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
}
