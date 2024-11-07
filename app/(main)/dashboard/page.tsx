import { PurchaseCourseList } from "@/features/course/components/purchase-course-list";

const DashboardPage = async () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">購入済み講座</h2>
        <PurchaseCourseList max_courses={8} />
      </div>
    </div>
  );
};

export default DashboardPage;
