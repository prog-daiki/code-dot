import { Hono } from "hono";
import { validateAuthMiddleware } from "../../auth/validate-auth-middleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getAuth } from "@hono/clerk-auth";
import { PublishCourse } from "./types/publish-course";
import { HandleError } from "../../error/handle-error";
import { CourseUseCase } from "./usecase/course-usecase";

const Course = new Hono<{
  Variables: {
    courseUseCase: CourseUseCase;
  };
}>()
  .use("*", async (c, next) => {
    c.set("courseUseCase", new CourseUseCase());
    await next();
  })

  /**
   * 公開講座一覧取得API
   * @route GET /api/courses/publish
   * @middleware validateAuthMiddleware - ユーザー権限の検証
   * @returns 公開講座一覧
   * @throws 公開講座一覧取得エラー
   */
  .get(
    "/publish",
    validateAuthMiddleware,
    zValidator(
      "query",
      z.object({
        title: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    ),
    async (c) => {
      const courseUseCase = c.get("courseUseCase");
      const validatedData = c.req.valid("query");
      const auth = getAuth(c);
      try {
        const courses: PublishCourse[] = await courseUseCase.getPublishCourses(
          auth!.userId!,
          validatedData.title,
          validatedData.categoryId,
        );
        return c.json(courses);
      } catch (error) {
        return HandleError(c, error, "公開講座一覧取得エラー");
      }
    },
  );

export default Course;
