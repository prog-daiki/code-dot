"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseCourseCard } from "./purchase-course-card";
import { useGetPurchaseCourses } from "../api/use-get-purchase-courses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PurchaseCourse } from "@/app/api/[[...route]]/core/course/types/purchase-course";

const SKELETON_COUNT = 8;

interface PurchaseCourseListProps {
  max_courses?: number;
  initialData?: PurchaseCourse[];
}

export const PurchaseCourseList = ({ max_courses, initialData }: PurchaseCourseListProps) => {
  const coursesQuery = useGetPurchaseCourses(initialData);
  const courses = coursesQuery.data || [];

  if (coursesQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  const displayedCourses = max_courses ? courses.slice(0, max_courses) : courses;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {displayedCourses.map((course) => (
          <PurchaseCourseCard
            category={course.category?.name ?? "未分類"}
            chaptersLength={course.chapters.length}
            id={course.course.id}
            imageUrl={course.course.imageUrl ?? "/images/no-image.png"}
            key={course.course.id}
            price={course.course.price ?? 0}
            title={course.course.title}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p className="mb-4">購入した講座が見つかりませんでした</p>
          <Link href="/courses">
            <Button variant="outline">講座一覧画面に戻る</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
