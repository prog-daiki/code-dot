import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;

  if (!isAdmin) {
    return redirect("/courses");
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-12">{children}</div>
    </div>
  );
};

export default AdminLayout;
