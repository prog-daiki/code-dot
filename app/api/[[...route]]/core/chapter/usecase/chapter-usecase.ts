import { CourseNotFoundError } from "../../../error/course-not-found-error";
import { CourseRepository } from "../../course/repository/course-repository";
import { MuxDataRepository } from "../../muxdata/repository/muxdata-repository";
import { ChapterRepository } from "../repository/chapter-repository";
import { Chapter } from "../types/chapter";

/**
 * チャプターに関するユースケースを管理するクラス
 */
export class ChapterUseCase {
  private chapterRepository: ChapterRepository;
  private courseRepository: CourseRepository;
  private muxDataRepository: MuxDataRepository;

  constructor() {
    this.chapterRepository = new ChapterRepository();
    this.courseRepository = new CourseRepository();
    this.muxDataRepository = new MuxDataRepository();
  }

  /**
   * チャプター一覧を取得する
   * @param courseId 講座ID
   * @returns チャプター一覧
   */
  async getChapters(courseId: string): Promise<Chapter[]> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }
    return await this.chapterRepository.getChapters(courseId);
  }
}
