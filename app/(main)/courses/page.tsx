import { SearchInput } from "@/app/_components/common/search-input";
import { getCategories } from "@/features/category/api/server/get-categories";

import { CategoryList } from "@/features/category/components/category-list";
import { getPublishCourses } from "@/features/course/api/server/get-publish-courses";
import { CourseList } from "@/features/course/components/course-list";

interface CoursesPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  const initialCategories = await getCategories();
  const initialCourses = await getPublishCourses(searchParams.title, searchParams.categoryId);
  return (
    <div className="mt-4 space-y-2">
      <CategoryList initialData={initialCategories} />
      <SearchInput />
      <div className="mt-4">
        <CourseList initialData={initialCourses} searchParams={searchParams} />
      </div>
    </div>
  );
};

export default CoursesPage;
