"use client";

import { ArrowLeft, LayoutDashboard, Loader2, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Banner } from "@/app/_components/common/banner";
import { IconBadge } from "@/app/_components/common/icon-badge";
import { Button } from "@/components/ui/button";
import { useGetChapter } from "@/features/chapter/api/use-get-chapter";
import { ChapterTitleForm } from "@/features/chapter/components/chapter-title-form";

const AdminChapterPage = ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { courseId, chapterId } = params;
  const { data: chapterWithMuxData, isLoading } = useGetChapter(courseId, chapterId);

  const chapter = chapterWithMuxData?.chapter;
  const muxData = chapterWithMuxData?.mux_data;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white pb-60">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  if (!chapter) {
    return redirect(`/admin/courses/${courseId}`);
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="space-y-4">
        <Link href={`/admin/courses/${courseId}`}>
          <Button variant="ghost">
            <ArrowLeft className="size-4 mr-2" />
            講座編集画面に戻る
          </Button>
        </Link>
        {!chapter.publishFlag && <Banner label="この講座は非公開です" />}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">チャプター設定</h1>
            <span className="text-sm text-slate-700">入力済みの必須項目 {completionText}</span>
          </div>
          {/* <ChapterActions
            courseId={courseId}
            chapterId={chapterId}
            disabled={!isComplete}
            isPublished={chapter.publishFlag!}
          /> */}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-semibold">チャプターのカスタマイズ</h2>
            </div>
            <ChapterTitleForm courseId={courseId} chapterId={chapterId} defaultValues={{ title: chapter.title }} />
            {/* <ChapterDescriptionForm
              courseId={courseId}
              chapterId={chapterId}
              defaultValues={{ description: chapter.description ?? "" }}
            /> */}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl font-semibold">動画</h2>
              </div>
              {/* <ChapterVideoForm courseId={courseId} chapterId={chapterId} chapter={chapter} muxData={muxData!} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChapterPage;
