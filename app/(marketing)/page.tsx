import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const MarketingPage = async () => {
  const { userId } = await auth();
  if (userId) {
    return redirect("/courses");
  }

  return <div>製作中...</div>;
};

export default MarketingPage;
