import { ChapterNotFoundError } from "../../../error/chapter-not-found-error";
import { CourseNotFoundError } from "../../../error/course-not-found-error";
import { CourseRepository } from "../../course/repository/course-repository";
import { MuxDataRepository } from "../../muxdata/repository/muxdata-repository";
import { ChapterRepository } from "../repository/chapter-repository";
import { Chapter } from "../types/chapter";
import { ChapterWithMuxData } from "../types/chapter-with-muxdata";

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

  /**
   * チャプターを取得する
   * @param courseId 講座ID
   * @param chapterId チャプターID
   * @returns チャプター
   */
  async getChapter(
    courseId: string,
    chapterId: string,
  ): Promise<ChapterWithMuxData> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    // チャプターの存在チェック
    const isChapterExists: boolean =
      await this.chapterRepository.isChapterExists(chapterId);
    if (!isChapterExists) {
      throw new ChapterNotFoundError();
    }

    return await this.chapterRepository.getChapterById(chapterId);
  }

  /**
   * チャプターを登録する
   * @param courseId 講座ID
   * @param title チャプター名
   * @returns チャプター
   */
  async registerChapter(courseId: string, title: string): Promise<Chapter> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    return await this.chapterRepository.registerChapter(courseId, title);
  }

  /**
   * チャプターのタイトルを更新する
   * @param courseId 講座ID
   * @param chapterId チャプターID
   * @param title チャプター名
   */
  async updateChapterTitle(
    courseId: string,
    chapterId: string,
    title: string,
  ): Promise<Chapter> {
    // 講座の存在チェック
    const isCourseExists: boolean = await this.courseRepository.isCourseExists(
      courseId,
    );
    if (!isCourseExists) {
      throw new CourseNotFoundError();
    }

    // チャプターの存在チェック
    const isChapterExists: boolean =
      await this.chapterRepository.isChapterExists(chapterId);
    if (!isChapterExists) {
      throw new ChapterNotFoundError();
    }

    return await this.chapterRepository.updateChapter(chapterId, { title });
  }
}
