"use client";

import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetChapters } from "../api/use-get-chapters";
import { useCreateChapter } from "../api/use-create-chapter";
import { useReorderChapter } from "../api/use-reorder-chapter";
import { ChapterList } from "./chapter-list";

interface ChapterFormProps {
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "タイトルは1文字以上です").max(100, "タイトルは100文字以内です"),
});

type FormValues = z.input<typeof formSchema>;

export const ChapterForm = ({ courseId }: ChapterFormProps) => {
  const { data: chapters = [] } = useGetChapters(courseId);
  const reorderMutation = useReorderChapter(courseId);
  const createMutation = useCreateChapter(courseId);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };
  const handleEdit = (id: string) => {
    router.push(`/admin/courses/${courseId}/chapters/${id}`);
  };
  const handleReorder = (updateData: { id: string; position: number }[]) => {
    reorderMutation.mutate(updateData);
  };

  const handleSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toggleCreating();
        router.refresh();
      },
    });
  };

  return (
    <div className="relative rounded-md border p-4 shadow-md">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="size-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        チャプター
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>取り消す</>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              追加する
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <div>
          <Form {...form}>
            <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="w-full rounded-md focus-visible:ring-slate-200"
                        disabled={reorderMutation.isPending}
                        placeholder="ReactでTodoアプリを作ろう"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={createMutation.isPending}>登録</Button>
            </form>
          </Form>
          <div className={cn("text-sm mt-4", !chapters.length && "text-slate-500")}>
            {!chapters.length && "チャプターが未登録です"}
            <ChapterList items={chapters} handleEdit={handleEdit} handleReorder={handleReorder} />
          </div>
        </div>
      )}
      {!isCreating && (
        <div className={cn("text-sm mt-2", !chapters.length && "text-slate-500")}>
          {!chapters.length && "チャプターが未登録です"}
          <ChapterList items={chapters} handleEdit={handleEdit} handleReorder={handleReorder} />
        </div>
      )}
      {!isCreating && <p className="mt-4 to-muted-foreground text-xs">チャプターの並べ替えが可能です</p>}
    </div>
  );
};
