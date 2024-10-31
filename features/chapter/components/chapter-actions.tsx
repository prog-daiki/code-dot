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
  const deleteMutation = useDeleteChapter(courseId, chapterId);
  const publishMutation = useUpdateChapterPublish(courseId, chapterId);
  const unpublishMutation = useUpdateChapterUnPublish(courseId, chapterId);

  const handlePublish = () => {
    if (isPublished) {
      unpublishMutation.mutate();
    } else {
      publishMutation.mutate();
      confetti.onOpen();
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    router.push(`/admin/courses/${courseId}`);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled || deleteMutation.isPending} onClick={handlePublish} size="sm" variant="outline">
        {isPublished ? "非公開にする" : "公開する"}
      </Button>
      <ConfirmModal onConfirm={handleDelete}>
        <Button disabled={deleteMutation.isPending} size="sm">
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
