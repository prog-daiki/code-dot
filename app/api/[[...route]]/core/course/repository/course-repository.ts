import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/drizzle";
import { PublishCourse } from "../types/publish-course";
import { category, chapter, course, muxData, purchase } from "@/db/schema";
import { AdminCourse } from "../types/admin-course";
import { PurchaseCourse } from "../types/purchase-course";
import { Course } from "../types/course";
import { PublishCourseWithMuxData } from "../types/publish-course-with-muxdata";
import { getCurrentJstDate } from "../../../common/date";

/**
 * 講座のリポジトリを管理するクラス
 */
export class CourseRepository {
  /**
   * 全ての講座を取得する
   * @returns {Promise<AdminCourse[]>} 講座一覧
   */
  async getAllCourses(): Promise<AdminCourse[]> {
    const data = await db
      .select({
        course,
        category,
        chapterLength: sql<number>`count(${chapter.id})::integer`.as("chapters"),
        purchasedNumber: sql<number>`count(${purchase.id})::integer`.as("purchasedNumber"),
      })
      .from(course)
      .leftJoin(chapter, and(eq(course.id, chapter.courseId), eq(chapter.publishFlag, true)))
      .leftJoin(category, eq(course.categoryId, category.id))
      .leftJoin(purchase, eq(course.id, purchase.courseId))
      .groupBy(course.id, category.id)
      .orderBy(desc(course.createDate));
    return data;
  }

  /**
   * 公開講座を一覧取得する
   * @param title
   * @param categoryId
   * @returns
   */
  async getPublishCourses(userId: string, title?: string, categoryId?: string): Promise<PublishCourse[]> {
    const data: PublishCourse[] = await db
      .select({
        course,
        category,
        chapters: sql<(typeof chapter.$inferSelect)[]>`
        coalesce(json_agg(
          json_build_object(
            'id', ${chapter.id},
            'title', ${chapter.title},
            'description', ${chapter.description},
            'videoUrl', ${chapter.videoUrl},
            'position', ${chapter.position},
            'publishFlag', ${chapter.publishFlag},
            'courseId', ${chapter.courseId},
            'createDate', ${chapter.createDate},
            'updateDate', ${chapter.updateDate}
          ) order by ${chapter.position}
        ) filter (where ${chapter.id} is not null), '[]')`.as("chapters"),
        purchased: sql<boolean>`case when ${purchase.id} is not null then true else false end`.as("purchased"),
      })
      .from(course)
      .leftJoin(chapter, eq(course.id, chapter.courseId))
      .leftJoin(category, eq(course.categoryId, category.id))
      .leftJoin(purchase, and(eq(course.id, purchase.courseId), userId ? eq(purchase.userId, userId) : undefined))
      .where(
        and(
          eq(course.publishFlag, true),
          eq(chapter.publishFlag, true),
          title ? ilike(course.title, `%${title}%`) : undefined,
          categoryId ? eq(course.categoryId, categoryId) : undefined,
        ),
      )
      .groupBy(course.id, category.id, purchase.id)
      .orderBy(desc(course.createDate));
    return data;
  }

  /**
   * 購入済み講座一覧を取得する
   * @param userId ユーザーID
   * @returns 購入済み講座一覧
   */
  async getPurchaseCourses(userId: string): Promise<PurchaseCourse[]> {
    const data: PurchaseCourse[] = await db
      .select({
        course,
        category,
        chapters: sql<(typeof chapter.$inferSelect)[]>`
      coalesce(json_agg(
        json_build_object(
          'id', ${chapter.id},
          'title', ${chapter.title},
          'description', ${chapter.description},
          'videoUrl', ${chapter.videoUrl},
          'position', ${chapter.position},
          'publishFlag', ${chapter.publishFlag},
          'courseId', ${chapter.courseId},
          'createDate', ${chapter.createDate},
          'updateDate', ${chapter.updateDate}
        ) order by ${chapter.position}
      ) filter (where ${chapter.id} is not null), '[]')`.as("chapters"),
      })
      .from(course)
      .leftJoin(chapter, eq(course.id, chapter.courseId))
      .leftJoin(category, eq(course.categoryId, category.id))
      .innerJoin(purchase, and(eq(course.id, purchase.courseId), userId ? eq(purchase.userId, userId) : undefined))
      .where(and(eq(course.publishFlag, true), eq(chapter.publishFlag, true)))
      .groupBy(course.id, category.id, purchase.id)
      .orderBy(desc(purchase.createDate));
    return data;
  }

  /**
   * 指定されたIDの講座を取得する
   * @param courseId 講座ID
   * @returns {Promise<Course | null>} 講座
   */
  async getCourseById(courseId: string): Promise<Course> {
    const [data]: Course[] = await db.select().from(course).where(eq(course.id, courseId));
    return data;
  }

  /**
   * 講座の存在チェック
   * @param courseId 講座ID
   * @returns {Promise<boolean>} 講座が存在する場合はtrue、そうでない場合はfalse
   */
  async isCourseExists(courseId: string): Promise<boolean> {
    const course = await this.getCourseById(courseId);
    return !!course;
  }

  /**
   * 公開講座を取得する
   * @param courseId
   * @returns
   */
  async getPublishCourse(courseId: string, userId?: string): Promise<PublishCourseWithMuxData> {
    const [data]: PublishCourseWithMuxData[] = await db
      .select({
        course,
        category,
        chapters: sql<
          (typeof chapter.$inferSelect & {
            muxData: typeof muxData.$inferSelect | null;
          })[]
        >`json_agg(
            json_build_object(
              'id', ${chapter.id},
              'title', ${chapter.title},
              'description', ${chapter.description},
              'videoUrl', ${chapter.videoUrl},
              'position', ${chapter.position},
              'publishFlag', ${chapter.publishFlag},
              'courseId', ${chapter.courseId},
              'createDate', ${chapter.createDate},
              'updateDate', ${chapter.updateDate},
              'muxData', case when ${muxData.id} is not null then
                json_build_object(
                  'id', ${muxData.id},
                  'assetId', ${muxData.assetId},
                  'playbackId', ${muxData.playbackId},
                  'chapterId', ${muxData.chapterId}
                )
              else null end
            )
            ORDER BY ${chapter.position} ASC
          ) filter (where ${chapter.id} is not null)
        `.as("chapters"),
        purchased: sql<boolean>`case when ${purchase.id} is not null then true else false end`.as("purchased"),
      })
      .from(course)
      .leftJoin(chapter, eq(course.id, chapter.courseId))
      .leftJoin(category, eq(course.categoryId, category.id))
      .leftJoin(muxData, eq(chapter.id, muxData.chapterId))
      .leftJoin(purchase, and(eq(course.id, purchase.courseId), userId ? eq(purchase.userId, userId) : undefined))
      .where(and(eq(course.id, courseId), eq(course.publishFlag, true), eq(chapter.publishFlag, true)))
      .groupBy(course.id, category.id, purchase.id);
    return data;
  }

  /**
   * 講座を登録する
   * @param title 講座のタイトル
   * @returns {Promise<Course>} 登録された講座オブジェクト
   */
  async registerCourse(title: string): Promise<Course> {
    const currentJstDate: Date = getCurrentJstDate();
    const [data]: Course[] = await db
      .insert(course)
      .values({
        id: createId(),
        title,
        createDate: currentJstDate,
        updateDate: currentJstDate,
      })
      .returning();
    return data;
  }

  /**
   * 講座を更新する
   * @param courseId 講座ID
   * @param updateData 更新するデータ
   * @returns 更新された講座
   */
  async updateCourse(courseId: string, updateData: Partial<Omit<typeof course.$inferInsert, "id" | "createDate">>) {
    const currentJstDate: Date = getCurrentJstDate();
    const [data]: Course[] = await db
      .update(course)
      .set({
        ...updateData,
        updateDate: currentJstDate,
      })
      .where(eq(course.id, courseId))
      .returning();
    return data;
  }

  /**
   * 講座を物理削除する
   * @param courseId
   * @returns
   */
  async deleteCourse(courseId: string): Promise<Course> {
    const [data] = await db.delete(course).where(eq(course.id, courseId)).returning();
    return data;
  }
}
