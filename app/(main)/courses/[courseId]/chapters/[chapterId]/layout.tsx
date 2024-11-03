"use client";

import React from "react";
import { useGetPublishCourse } from "@/features/course/api/use-get-publish-course";
import { PlayerChapter } from "./_components/player-chapter";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const ChapterLayout = ({
  params,
  children,
}: {
  params: { courseId: string; chapterId: string };
  children: React.ReactNode;
}) => {
  const { courseId, chapterId } = params;
  const { data: publishCourse, isLoading } = useGetPublishCourse({
    courseId,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white pb-60">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  const course = publishCourse?.course;
  const chapters = publishCourse?.chapters;
  const purchased = publishCourse?.purchased!;
  const currentChapter = chapters?.find((chapter) => chapter.id === chapterId);

  if (purchased === false) {
    return redirect(`/courses/${courseId}`);
  }

  return (
    <>
      <Link href={`/courses/${courseId}`} className="text-muted-foreground text-md">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="size-4" />
          講座画面に戻る
        </Button>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 lg:gap-4">
        <div className="order-2 lg:order-1 lg:col-span-1">
          <div className="space-y-4 border p-4 rounded-md mb-4 shadow-md">
            <h2 className="text-md md:text-xl font-bold">{course?.title}</h2>
            <p className="text-muted-foreground text-sm">{course?.description}</p>
            <div className="flex space-x-4 text-xs lg:text-sm">
              <p className="text-muted-foreground">更新日時：{new Date(course?.updateDate!).toLocaleDateString()}</p>
              <p className="text-muted-foreground">作成日時：{new Date(course?.createDate!).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4">
              <Link href={course?.sourceUrl!} target="_blank">
                <Button variant="outline" className="gap-2">
                  <FaGithub className="size-4" />
                  Source Code
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-slate-600 text-white p-4 rounded-t-md">
            <h3 className="text-xl font-bold">Chapter</h3>
          </div>
          {chapters?.map((chapter) => (
            <PlayerChapter
              key={chapter.id}
              purchased={purchased}
              chapterTitle={chapter.title}
              courseId={courseId}
              chapterId={chapter.id}
              isCurrentChapter={currentChapter?.id === chapter.id}
            />
          ))}
        </div>
        <div className="order-1 lg:order-2 lg:col-span-2 lg:px-2">{children}</div>
      </div>
    </>
  );
};

export default ChapterLayout;
