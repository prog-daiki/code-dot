import { Hono } from "hono";
import { validateAuthMiddleware } from "../../auth/validate-auth-middleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getAuth } from "@hono/clerk-auth";
import { PublishCourse } from "./types/publish-course";
import { HandleError } from "../../error/handle-error";
import { CourseUseCase } from "./usecase/course-usecase";
import { validateAdminMiddleware } from "../../auth/validate-admin-middleware";
import { AdminCourse } from "./types/admin-course";
import { PurchaseCourse } from "./types/purchase-course";

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
   * 講座一覧取得API
   * @route GET /api/courses
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns 講座一覧
   * @throws 講座一覧取得エラー
   */
  .get("/", validateAdminMiddleware, async (c) => {
    const courseUseCase = c.get("courseUseCase");
    try {
      const courses: AdminCourse[] = await courseUseCase.getCourses();
      console.log(`講座一覧を取得しました: ${courses.length}件`);
      return c.json(courses);
    } catch (error) {
      return HandleError(c, error, "講座一覧取得エラーが発生しました。");
    }
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
  )

  /**
   * 購入済み講座一覧取得API
   * @route GET /api/courses/purchased
   * @middleware validateAuthMiddleware - ユーザー権限の検証
   * @returns 購入済み講座一覧
   * @throws 購入済み講座一覧取得エラー
   */
  .get("/purchased", validateAuthMiddleware, async (c) => {
    const auth = getAuth(c);
    const courseUseCase = c.get("courseUseCase");
    try {
      const courses: PurchaseCourse[] = await courseUseCase.getPurchaseCourses(
        auth!.userId!,
      );
      return c.json(courses);
    } catch (error) {
      return HandleError(c, error, "購入済み講座一覧取得エラー");
    }
  });

export default Course;
