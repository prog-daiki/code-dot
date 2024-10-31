"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateChapterTitle } from "../api/use-update-chapter-title";

const formSchema = z.object({
  title: z.string().min(1, "タイトルは1文字以上です").max(100, "タイトルは100文字以内です"),
});

type FormValues = z.input<typeof formSchema>;

interface ChapterTitleFormProps {
  courseId: string;
  chapterId: string;
  defaultValues?: FormValues;
}

export const ChapterTitleForm = ({ courseId, chapterId, defaultValues }: ChapterTitleFormProps) => {
  const mutation = useUpdateChapterTitle(courseId, chapterId);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: (updatedChapter) => {
        toggleEdit();
        queryClient.setQueryData(["chapter", chapterId], updatedChapter);
      },
    });
  };

  return (
    <div className="rounded-md border p-4 shadow-md space-y-2">
      <div className="flex items-center justify-between font-medium">
        <h3 className="border-b border-sky-500 font-semibold">タイトル</h3>
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
      {!isEditing && <p className="mt-2 text-sm">{defaultValues?.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full rounded-md focus-visible:ring-slate-200"
                      disabled={mutation.isPending}
                      placeholder="ReactでTodoアプリを作ろう"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={mutation.isPending}>変更を保存</Button>
          </form>
        </Form>
      )}
    </div>
  );
};
