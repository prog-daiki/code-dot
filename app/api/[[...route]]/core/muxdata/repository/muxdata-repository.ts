import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { MuxData } from "../types/muxdata";
import { chapter, muxData } from "@/db/schema";

/**
 * MuxDataを管理するリポジトリ
 */
export class MuxDataRepository {
  /**
   * 講座IDからmuxDataを取得する
   * @param courseId
   * @returns
   */
  async getMuxDataByCourseId(courseId: string): Promise<MuxData[]> {
    const data = await db
      .select({
        id: muxData.id,
        assetId: muxData.assetId,
        playbackId: muxData.playbackId,
        chapterId: muxData.chapterId,
      })
      .from(muxData)
      .innerJoin(chapter, eq(muxData.chapterId, chapter.id))
      .where(eq(chapter.courseId, courseId));
    return data;
  }
}
