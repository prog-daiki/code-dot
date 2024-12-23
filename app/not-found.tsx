import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <Image src="/images/not-found.png" alt="404" width={500} height={500} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-md text-center">お探ししているページは見つかりませんでした。</h1>
        <Link href="/">
          <Button variant="outline">トップページに戻る</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
