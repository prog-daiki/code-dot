"use client";

import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ConfirmModal } from "@/app/_components/common/confirm-modal";
import { useDeleteChapter } from "../api/use-delete-chapter";
import { useUpdateChapterPublish } from "../api/use-update-chapter-publish";
import { useUpdateChapterUnPublish } from "../api/use-update-chapter-unpublish";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  disabled: boolean;
  isPublished: boolean;
}

export const ChapterActions = ({ courseId, chapterId, disabled, isPublished }: ChapterActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const mutations = {
    delete: useDeleteChapter(courseId, chapterId),
    publish: useUpdateChapterPublish(courseId, chapterId),
    unpublish: useUpdateChapterUnPublish(courseId, chapterId),
  };

  const isLoading = Object.values(mutations).some((mutation) => mutation.isPending);

  const handlePublish = async () => {
    try {
      if (isPublished) {
        await mutations.unpublish.mutateAsync();
      } else {
        await mutations.publish.mutateAsync();
        confetti.onOpen();
      }
    } catch (error) {
      console.error("チャプターの公開状態の更新に失敗しました:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await mutations.delete.mutateAsync();
      router.push(`/admin/courses/${courseId}`);
    } catch (error) {
      console.error("チャプターの削除に失敗しました:", error);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled || isLoading} onClick={handlePublish} size="sm" variant="outline">
        {isPublished ? "非公開にする" : "公開する"}
      </Button>
      <ConfirmModal onConfirm={handleDelete}>
        <Button disabled={isLoading} size="sm">
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
