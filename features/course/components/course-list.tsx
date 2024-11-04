"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublishCourses } from "../api/use-get-publish-courses";
import { CourseCard } from "./course-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseListProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SKELETON_COUNT = 8;

export const CourseList = ({ searchParams }: CourseListProps) => {
  const coursesQuery = useGetPublishCourses({
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  });
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

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard
            category={course.category!.name}
            chaptersLength={course.chapters.length}
            id={course.course.id}
            imageUrl={course.course.imageUrl!}
            key={course.course.id}
            price={course.course.price!}
            title={course.course.title}
            purchased={course.purchased}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p className="mb-4">講座が見つかりませんでした</p>
          <Link href="/courses">
            <Button variant="outline">検索条件をクリア</Button>
          </Link>
        </div>
      )}
    </>
  );
};
