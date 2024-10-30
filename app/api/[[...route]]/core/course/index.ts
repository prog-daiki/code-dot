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
import type { Course } from "./types/course";
import { Entity, Messages } from "../../common/message";
import { CourseNotFoundError } from "../../error/course-not-found-error";
import { PublishCourseWithMuxData } from "./types/publish-course-with-muxdata";

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
  })

  /**
   * 講座取得API
   * @route GET /api/courses/:course_id
   * @middleware validateAdminMiddleware - 管理者権限の検証
   * @returns 講座
   * @throws CourseNotFoundError
   * @throws 講座取得エラー
   */
  .get(
    "/:course_id",
    validateAdminMiddleware,
    zValidator("param", z.object({ course_id: z.string() })),
    async (c) => {
      const { course_id: courseId } = c.req.valid("param");
      const courseUseCase = c.get("courseUseCase");
      try {
        const course: Course = await courseUseCase.getCourse(courseId);
        return c.json(course);
      } catch (error) {
        if (error instanceof CourseNotFoundError) {
          console.error(`存在しない講座です: ID ${courseId}`);
          return c.json({ error: Messages.MSG_ERR_003(Entity.COURSE) }, 404);
        }
        return HandleError(c, error, "講座取得エラー");
      }
    },
  )

  /**
   * 公開講座取得API
   * @route GET /api/courses/:course_id
   * @middleware validateAuthMiddleware - ユーザー権限の検証
   * @returns 公開講座
   * @throws CourseNotFoundError
   * @throws 公開講座取得エラー
   */
  .get(
    "/:course_id/publish",
    validateAuthMiddleware,
    zValidator("param", z.object({ course_id: z.string() })),
    async (c) => {
      const { course_id: courseId } = c.req.valid("param");
      const courseUseCase = c.get("courseUseCase");
      const auth = getAuth(c);
      try {
        const course: PublishCourseWithMuxData =
          await courseUseCase.getPublishCourse(courseId, auth!.userId!);
        return c.json(course);
      } catch (error) {
        if (error instanceof CourseNotFoundError) {
          console.error(`存在しない講座です: ID ${courseId}`);
          return c.json({ error: Messages.MSG_ERR_003(Entity.COURSE) }, 404);
        }
        return HandleError(c, error, "公開講座取得エラー");
      }
    },
  );

export default Course;
