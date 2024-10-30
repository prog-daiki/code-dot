import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { validateAdminMiddleware } from "../../auth/validate-admin-middleware";
import type { Chapter } from "./types/chapter";
import { CourseNotFoundError } from "../../error/course-not-found-error";
import { Entity, Messages } from "../../common/message";
import { HandleError } from "../../error/handle-error";
import { ChapterUseCase } from "./usecase/chapter-usecase";

const Chapter = new Hono<{
  Variables: {
    chapterUseCase: ChapterUseCase;
  };
}>()
  .use("*", async (c, next) => {
    c.set("chapterUseCase", new ChapterUseCase());
    await next();
  })

  /**
   * チャプター一覧取得API
   * @route GET /api/courses/{course_id}/chapters
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns チャプター一覧
   * @throws CourseNotFoundError
   * @throws チャプター一覧取得エラー
   */
  .get(
    "/",
    validateAdminMiddleware,
    zValidator("param", z.object({ course_id: z.string() })),
    async (c) => {
      const { course_id: courseId } = c.req.valid("param");
      const chapterUseCase = c.get("chapterUseCase");
      try {
        const chapters: Chapter[] = await chapterUseCase.getChapters(courseId);
        return c.json(chapters);
      } catch (error) {
        if (error instanceof CourseNotFoundError) {
          console.error(`存在しない講座です: ID ${courseId}`);
          return c.json(Messages.MSG_ERR_003(Entity.COURSE), 404);
        }
        return HandleError(c, error, "チャプター一覧取得エラー");
      }
    },
  );
