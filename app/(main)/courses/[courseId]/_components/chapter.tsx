"use client";

import { IconBadge } from "@/app/_components/common/icon-badge";
import { cn } from "@/lib/utils";
import { Lock, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type ChapterProps = {
  purchased: boolean;
  chapterTitle: string;
  chapterDescription?: string;
  courseId: string;
  chapterId: string;
};

export const Chapter = ({ purchased, chapterTitle, chapterDescription, courseId, chapterId }: ChapterProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/courses/${courseId}/chapters/${chapterId}`);
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-lg border p-4 w-full hover:bg-slate-100 transition",
        !purchased && "bg-slate-100 cursor-not-allowed",
      )}
      disabled={!purchased}
    >
      <div className="flex gap-x-4 items-center">
        <IconBadge icon={purchased ? PlayCircle : Lock} size="md" />
        <div className="text-left">
          <p className="text-sm md:text-xl font-semibold">{chapterTitle}</p>
        </div>
      </div>
    </button>
  );
};
