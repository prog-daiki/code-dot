import { CourseNotFoundError } from "../../../error/course-not-found-error";
import { CategoryRepository } from "../../category/repository/category-repository";
import { CourseRepository } from "../repository/course-repository";
import { AdminCourse } from "../types/admin-course";
import { Course } from "../types/course";
import { PublishCourse } from "../types/publish-course";
import { PublishCourseWithMuxData } from "../types/publish-course-with-muxdata";
import { PurchaseCourse } from "../types/purchase-course";

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

  /**
   * 購入済み講座一覧を取得する
   * @param userId ユーザーID
   * @returns 購入済み講座一覧
   */
  async getPurchaseCourses(userId: string): Promise<PurchaseCourse[]> {
    const courses: PurchaseCourse[] =
      await this.courseRepository.getPurchaseCourses(userId);
    return courses;
  }

  /**
   * 講座を取得する
   * @param courseId 講座ID
   * @returns 講座
   */
  async getCourse(courseId: string): Promise<Course> {
    // 講座の存在チェック
    const course: Course = await this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }

    return course;
  }

  /**
   * 公開講座を取得する
   * @param courseId 講座ID
   * @returns 公開講座
   */
  async getPublishCourse(
    courseId: string,
    userId?: string,
  ): Promise<PublishCourseWithMuxData> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    return await this.courseRepository.getPublishCourse(courseId, userId);
  }

  /**
   * 講座を登録する
   * @param title 講座のタイトル
   * @returns 登録された講座
   */
  async registerCourse(title: string): Promise<Course> {
    return await this.courseRepository.registerCourse(title);
  }

  /**
   * 講座のタイトルを更新する
   * @param courseId 講座ID
   * @param title 講座のタイトル
   * @returns 更新された講座
   */
  async updateCourseTitle(courseId: string, title: string): Promise<Course> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    return await this.courseRepository.updateCourse(courseId, { title });
  }

  /**
   * 講座の詳細を更新する
   * @param courseId 講座ID
   * @param description 講座の詳細
   * @returns 更新された講座
   */
  async updateCourseDescription(
    courseId: string,
    description: string,
  ): Promise<Course> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    return await this.courseRepository.updateCourse(courseId, { description });
  }

  /**
   * 講座のサムネイルを更新する
   * @param courseId 講座ID
   * @param imageUrl 講座のサムネイル
   * @returns 更新された講座
   */
  async updateCourseThumbnail(
    courseId: string,
    imageUrl: string,
  ): Promise<Course> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    return await this.courseRepository.updateCourse(courseId, { imageUrl });
  }
}
