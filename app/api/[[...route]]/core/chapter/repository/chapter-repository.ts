import { db } from "@/db/drizzle";
import { Chapter } from "../types/chapter";
import { chapter } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

/**
 * チャプターのリポジトリを管理するクラス
 */
export class ChapterRepository {
  /**
   * 講座に紐づくチャプター(公開済み)を一覧取得する
   * @param courseId
   * @returns
   */
  async getPublishChapters(courseId: string): Promise<Chapter[]> {
    const chapters = await db
      .select()
      .from(chapter)
      .where(and(eq(chapter.courseId, courseId), eq(chapter.publishFlag, true)))
      .orderBy(asc(chapter.position));
    return chapters;
  }
}
