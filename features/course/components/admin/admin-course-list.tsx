"use client";

import { AdminCourse } from "@/app/api/[[...route]]/core/course/types/admin-course";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourses } from "../../api/use-get-courses";
import { AdminCourseCard } from "./admin-course-card";

const SKELETON_COUNT = 8;

interface AdminCourseListProps {
  max_courses?: number;
}

const CourseListSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full" />
      ))}
    </div>
  );
};

export const AdminCourseList = ({ max_courses }: AdminCourseListProps) => {
  const coursesQuery = useGetCourses();
  const courses: AdminCourse[] = coursesQuery.data || [];
  const filteredCourses = courses.slice(0, max_courses);

  if (coursesQuery.isLoading) {
    return <CourseListSkeleton />;
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <AdminCourseCard
            category={course.category?.name ?? "未分類"}
            chaptersLength={course.chapterLength}
            id={course.course.id}
            imageUrl={course.course.imageUrl ?? "/images/no-image.png"}
            key={course.course.id}
            price={course.course.price ?? 0}
            title={course.course.title}
            purchasedNumber={course.purchasedNumber}
            publishFlag={course.course.publishFlag}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">講座が見つかりませんでした</div>
      )}
    </div>
  );
};
