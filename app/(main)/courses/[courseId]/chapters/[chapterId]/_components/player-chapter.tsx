"use client";

import { IconBadge } from "@/app/_components/common/icon-badge";
import { cn } from "@/lib/utils";
import { Lock, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type PlayerChapterProps = {
  purchased: boolean;
  chapterTitle: string;
  courseId: string;
  chapterId: string;
  isCurrentChapter: boolean;
};

export const PlayerChapter = ({
  purchased,
  chapterTitle,
  courseId,
  chapterId,
  isCurrentChapter,
}: PlayerChapterProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/courses/${courseId}/chapters/${chapterId}`);
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-lg p-4 w-full hover:bg-slate-100 transition border border-gray-100/80",
        isCurrentChapter && "bg-slate-100",
      )}
      disabled={!purchased}
    >
      <div className="flex gap-x-4 items-center">
        <IconBadge icon={purchased ? PlayCircle : Lock} size="md" />
        <div className=" text-left">
          <p className="font-semibold">{chapterTitle}</p>
        </div>
      </div>
    </button>
  );
};
