import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CourseInfo } from "./_components/course-info";
import { getPublishCourse } from "@/features/course/api/server/get-publish-course";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const initialCourse = await getPublishCourse(courseId);

  return (
    <div className="mt-4">
      <Link href="/courses" className="text-muted-foreground text-md">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="size-4" />
          講座一覧に戻る
        </Button>
      </Link>
      <CourseInfo courseId={courseId} initialData={initialCourse} />
    </div>
  );
};

export default CoursePage;
