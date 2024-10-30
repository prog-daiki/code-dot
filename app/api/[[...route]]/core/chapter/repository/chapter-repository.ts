import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { Chapter } from "../types/chapter";
import { chapter } from "@/db/schema";

/**
 * チャプターのリポジトリを管理するクラス
 */
export class ChapterRepository {
  /**
   * 講座に紐づくチャプター一覧を取得する
   * @param courseId 講座ID
   * @returns チャプター一覧
   */
  async getChapters(courseId: string): Promise<Chapter[]> {
    const data: Chapter[] = await db
      .select()
      .from(chapter)
      .where(eq(chapter.courseId, courseId))
      .orderBy(asc(chapter.position));
    return data;
  }

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
