import { db } from "@/db/drizzle";
import { PublishCourse } from "../types/publish-course";
import { category, chapter, course, purchase } from "@/db/schema";
import { and, desc, eq, ilike, sql } from "drizzle-orm";

/**
 * 講座のリポジトリを管理するクラス
 */
export class CourseRepository {
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
}
