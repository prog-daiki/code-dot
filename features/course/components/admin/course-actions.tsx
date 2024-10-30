"use client";

import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useDeleteCourse } from "../../api/use-delete-course";
import { ConfirmModal } from "@/app/_components/common/confirm-modal";
import { useUpdateCourseUnpublish } from "../../api/use-update-course-unpublish";
import { useUpdateCoursePublish } from "../../api/use-update-course-publish";

interface ActionsProps {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}

export const CourseActions = ({
  courseId,
  disabled,
  isPublished,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const deleteMutation = useDeleteCourse(courseId);
  const publishMutation = useUpdateCoursePublish(courseId);
  const unpublishMutation = useUpdateCourseUnpublish(courseId);

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
    router.push("/admin/courses");
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || deleteMutation.isPending}
        onClick={handlePublish}
        size="sm"
        variant="outline"
      >
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
