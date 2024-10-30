import { AdminCourseList } from "@/features/course/components/admin/admin-course-list";
import { CreateCourse } from "@/features/course/components/admin/create-course";

const AdminCoursesPage = () => {
  return (
    <div className="space-y-4">
      <CreateCourse />
      <AdminCourseList />
    </div>
  );
};

export default AdminCoursesPage;
