"use client";

import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { FileUpload } from "@/app/_components/common/file-upload";
import { Chapter } from "@/app/api/[[...route]]/core/chapter/types/chapter";
import { MuxData } from "@/app/api/[[...route]]/core/muxdata/types/muxdata";
import { useUpdateChapterVideo } from "../api/use-update-chapter-video";

const formSchema = z.object({
  videoUrl: z.string().min(1, "動画URLは必須です").url("有効なURLを入力してください"),
});

type FormValues = z.input<typeof formSchema>;

interface ChapterVideoFormProps {
  courseId: string;
  chapterId: string;
  chapter: Chapter;
  muxData: MuxData | null;
}

export const ChapterVideoForm = ({ courseId, chapterId, chapter, muxData }: ChapterVideoFormProps) => {
  const mutation = useUpdateChapterVideo(courseId, chapterId);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: (updatedChapter) => {
        toggleEdit();
        queryClient.setQueryData(["chapter", chapterId], updatedChapter);
      },
    });
  };

  return (
    <div className="mt-4 rounded-md border p-4 shadow-md">
      <div className="flex items-center justify-between font-medium mb-2">
        <h3 className="border-b border-sky-500 font-semibold">動画</h3>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>取り消す</>}
          {!isEditing && !chapter.videoUrl && (
            <>
              <PlusCircle className="mr-2 size-4" />
              動画を追加
            </>
          )}
          {!isEditing && chapter.videoUrl && (
            <>
              <Pencil className="mr-2 size-4" />
              動画を編集する
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!chapter.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="size-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                handleSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">このチャプターの動画をアップロードする</div>
        </div>
      )}
      {chapter.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          動画は数分で処理されます。動画が表示されない場合は、ページを更新してください。
        </div>
      )}
    </div>
  );
};
