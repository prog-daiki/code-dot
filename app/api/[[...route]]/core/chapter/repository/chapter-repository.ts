import { and, asc, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/drizzle";
import { Chapter } from "../types/chapter";
import { chapter, muxData } from "@/db/schema";
import { ChapterWithMuxData } from "../types/chapter-with-muxdata";
import { getCurrentJstDate } from "../../../common/date";

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

  /**
   * チャプターの存在チェック
   * @param chapterId チャプターID
   * @returns {Promise<boolean>} チャプターが存在する場合はtrue、そうでない場合はfalse
   */
  async isChapterExists(chapterId: string): Promise<boolean> {
    const chapter: ChapterWithMuxData | null = await this.getChapterById(
      chapterId,
    );
    return !!chapter;
  }

  /**
   * チャプターを取得する
   * @param chapterId チャプターID
   * @returns チャプター
   */
  async getChapterById(chapterId: string): Promise<ChapterWithMuxData> {
    const [data]: ChapterWithMuxData[] = await db
      .select()
      .from(chapter)
      .leftJoin(muxData, eq(chapter.id, muxData.chapterId))
      .where(eq(chapter.id, chapterId));
    return data;
  }

  /**
   * チャプターを登録する
   * @param courseId 講座ID
   * @param title チャプター名
   * @returns チャプター
   */
  async registerChapter(courseId: string, title: string): Promise<Chapter> {
    const currentJstDate: Date = getCurrentJstDate();
    const chapters: Chapter[] = await this.getChapters(courseId);
    const newPosition: number =
      chapters.length > 0 ? chapters[chapters.length - 1].position + 1 : 1;
    const [data]: Chapter[] = await db
      .insert(chapter)
      .values({
        id: createId(),
        courseId,
        title,
        position: newPosition,
        createDate: currentJstDate,
        updateDate: currentJstDate,
      })
      .returning();
    return data;
  }

  /**
   * チャプターを更新する
   * @param chapterId チャプターID
   * @param updateData 更新データ
   * @returns 更新したチャプター
   */
  async updateChapter(
    chapterId: string,
    updateData: Partial<Omit<typeof chapter.$inferInsert, "id" | "createDate">>,
  ): Promise<Chapter> {
    const currentJstDate: Date = getCurrentJstDate();
    const [data]: Chapter[] = await db
      .update(chapter)
      .set({ ...updateData, updateDate: currentJstDate })
      .where(eq(chapter.id, chapterId))
      .returning();
    return data;
  }

  /**
   * チャプターを削除する
   * @param chapterId チャプターID
   */
  async deleteChapter(chapterId: string): Promise<Chapter> {
    const [data]: Chapter[] = await db
      .delete(chapter)
      .where(eq(chapter.id, chapterId))
      .returning();
    return data;
  }
}
