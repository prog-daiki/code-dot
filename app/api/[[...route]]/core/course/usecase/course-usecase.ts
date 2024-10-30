import { CategoryRepository } from "../../category/repository/category-repository";
import { CourseRepository } from "../repository/course-repository";
import { AdminCourse } from "../types/admin-course";
import { PublishCourse } from "../types/publish-course";

/**
 * 講座に関するユースケースを管理するクラス
 */
export class CourseUseCase {
  private courseRepository: CourseRepository;
  private categoryRepository: CategoryRepository;
  // private chapterRepository: ChapterRepository;
  // private muxDataRepository: MuxDataRepository;
  // private purchaseRepository: PurchaseRepository;
  // private stripeCustomerRepository: StripeCustomerRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.categoryRepository = new CategoryRepository();
    // this.chapterRepository = new ChapterRepository();
    // this.muxDataRepository = new MuxDataRepository();
    // this.purchaseRepository = new PurchaseRepository();
    // this.stripeCustomerRepository = new StripeCustomerRepository();
  }

  /**
   * 講座一覧を取得する
   * @returns 講座一覧
   */
  async getCourses(): Promise<AdminCourse[]> {
    return await this.courseRepository.getAllCourses();
  }

  /**
   * 公開講座一覧を取得する
   * @param title 講座のタイトル
   * @param categoryId カテゴリーID
   * @param userId ユーザーID
   * @returns 公開講座一覧
   */
  async getPublishCourses(
    userId: string,
    title?: string,
    categoryId?: string,
  ): Promise<PublishCourse[]> {
    return await this.courseRepository.getPublishCourses(
      userId,
      title,
      categoryId,
    );
  }
}
