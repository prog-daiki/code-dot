import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";
import { PublishCourseWithMuxData } from "@/app/api/[[...route]]/core/course/types/publish-course-with-muxdata";
import { client } from "@/lib/hono";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetPublishCourse = ({
  courseId,
}: {
  courseId: string;
}): UseQueryResult<PublishCourseWithMuxData, Error> => {
  return useQuery<PublishCourseWithMuxData, Error>({
    queryKey: ["publish-course", courseId],
    queryFn: async () => {
      const response = await client.api.courses[":course_id"].publish.$get({
        param: { course_id: courseId },
      });

      if (!response.ok) {
        throw new Error(`公開講座取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      const course: PublishCourseWithMuxData = {
        ...data,
        course: {
          ...data.course,
          createDate: new Date(data.course.createDate),
          updateDate: new Date(data.course.updateDate),
        },
        chapters: data.chapters.map((chapter: Chapter) => ({
          ...chapter,
          createDate: new Date(chapter.createDate),
          updateDate: new Date(chapter.updateDate),
        })),
      };
      return course;
    },
  });
};
