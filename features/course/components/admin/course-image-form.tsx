import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUpdateCourseImage } from "../../api/use-update-course-image";
import { FileUpload } from "@/app/_components/common/file-upload";

const formSchema = z.object({
  imageUrl: z.string().url("有効なURLを入力してください").min(1, "サムネイルは必須です"),
});

type FormValues = z.input<typeof formSchema>;

interface CourseImageFormProps {
  courseId: string;
  defaultValues?: FormValues;
}

export const CourseImageForm = ({ courseId, defaultValues }: CourseImageFormProps) => {
  const mutation = useUpdateCourseImage(courseId);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: (updatedCourse) => {
        toggleEdit();
        queryClient.setQueryData(["course", courseId], updatedCourse);
      },
    });
  };

  return (
    <div className="rounded-md border p-4 shadow-md space-y-2">
      <div className="flex items-center justify-between font-medium">
        <h3 className="border-b border-sky-500 font-semibold">サムネイル</h3>
        <Button className="px-4" onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>取り消す</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              編集する
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!defaultValues?.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="size-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image alt="Upload" className="rounded-md object-cover" fill src={defaultValues.imageUrl} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                handleSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">16:9の比率が推奨です</div>
        </div>
      )}{" "}
    </div>
  );
};
