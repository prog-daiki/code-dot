"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <Image src="/images/error.png" alt="404" width={500} height={500} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-md text-center">予期せぬエラーが発生しました。時間をおいて再度お試し下さい。</h1>
        <Link href="/">
          <Button variant="outline">トップページに戻る</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
