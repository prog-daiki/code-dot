import { SearchInput } from "@/app/_components/common/search-input";
import { CategoryList } from "@/features/category/components/category-list";

interface CoursesPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const CoursesPage = ({ searchParams }: CoursesPageProps) => {
  return (
    <div className="mt-4 space-y-2">
      <CategoryList />
      <SearchInput />
      <div className="mt-4">
        {/* <CourseList searchParams={searchParams} /> */}
      </div>
    </div>
  );
};

export default CoursesPage;
