"use client";

import { Separator } from "@/components/ui/separator";
import { useGetChapter } from "@/features/chapter/api/use-get-chapter";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const ChapterPage = ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { courseId, chapterId } = params;
  const { data: chapter, isLoading, error } = useGetChapter(courseId, chapterId);

  if (error) {
    return (
      <div className="w-full min-h-screen flex justify-center bg-white pt-40">
        <p className="text-red-500">エラーが発生しました。再度お試しください。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center bg-white pt-40">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  if (!chapter) {
    return redirect(`/courses/${courseId}`);
  }

  return (
    <>
      <div className="relative aspect-video space-y-4">
        <MuxPlayer playbackId={chapter?.mux_data?.playbackId!} className="shadow-md" autoPlay />
        <div className="flex flex-col space-y-4 border p-4 rounded-md shadow-md">
          <h1 className="text-2xl font-bold">{chapter?.chapter.title}</h1>
          <Separator />
          <p className="text-sm text-muted-foreground">{chapter?.chapter.description}</p>
        </div>
      </div>
    </>
  );
};

export default ChapterPage;
