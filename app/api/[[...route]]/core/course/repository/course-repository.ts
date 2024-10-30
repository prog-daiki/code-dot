import { db } from "@/db/drizzle";
import { PublishCourse } from "../types/publish-course";
import { category, chapter, course, purchase } from "@/db/schema";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { AdminCourse } from "../types/admin-course";
import { PurchaseCourse } from "../types/purchase-course";

/**
 * 講座のリポジトリを管理するクラス
 */
export class CourseRepository {
  /**
   * 全ての講座を取得する
   * @returns {Promise<AdminCourse[]>} 講座一覧
   */
  async getAllCourses(): Promise<AdminCourse[]> {
    const purchaseCountSubquery = db
      .select({
        courseId: purchase.courseId,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(purchase)
      .groupBy(purchase.courseId)
      .as("purchaseCount");

    const data = await db
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
        purchasedNumber:
          sql<number>`coalesce(${purchaseCountSubquery.count}, 0)`.as(
            "purchasedNumber",
          ),
      })
      .from(course)
      .leftJoin(chapter, eq(course.id, chapter.courseId))
      .leftJoin(category, eq(course.categoryId, category.id))
      .leftJoin(
        purchaseCountSubquery,
        eq(course.id, purchaseCountSubquery.courseId),
      )
      .groupBy(course.id, category.id, purchaseCountSubquery.count)
      .orderBy(desc(course.createDate));
    return data;
  }

  /**
   * 公開講座を一覧取得する
   * @param title
   * @param categoryId
   * @returns
   */
  async getPublishCourses(
    userId: string,
    title?: string,
    categoryId?: string,
  ): Promise<PublishCourse[]> {
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
        purchased:
          sql<boolean>`case when ${purchase.id} is not null then true else false end`.as(
            "purchased",
          ),
      })
      .from(course)
      .leftJoin(chapter, eq(course.id, chapter.courseId))
      .leftJoin(category, eq(course.categoryId, category.id))
      .leftJoin(
        purchase,
        and(
          eq(course.id, purchase.courseId),
          userId ? eq(purchase.userId, userId) : undefined,
        ),
      )
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
      .innerJoin(
        purchase,
        and(
          eq(course.id, purchase.courseId),
          userId ? eq(purchase.userId, userId) : undefined,
        ),
      )
      .where(and(eq(course.publishFlag, true), eq(chapter.publishFlag, true)))
      .groupBy(course.id, category.id, purchase.id)
      .orderBy(desc(course.createDate));
    return data;
  }
}
