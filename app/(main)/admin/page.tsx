import { Button } from "@/components/ui/button";
import { AdminCourseList } from "@/features/course/components/admin/admin-course-list";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">講座</h2>
      <AdminCourseList max_courses={8} />
      <div className="mt-4 flex justify-end">
        <Link href="/admin/courses">
          <Button variant="ghost" className="text-muted-foreground">
            <ArrowRight className="size-4 mr-2" />
            講座管理画面
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
