"use client";

import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/features/category/api/use-get-categories";
import { Combobox } from "@/components/ui/combobox";
import { useUpdateCourseCategory } from "../../api/use-update-course-category";

const formSchema = z.object({
  categoryId: z.string().min(1, "カテゴリーIDは必須です"),
});

type FormValues = z.input<typeof formSchema>;

interface CourseCategoryFormProps {
  courseId: string;
  defaultValues?: FormValues;
}

export const CourseCategoryForm = ({ courseId, defaultValues }: CourseCategoryFormProps) => {
  const mutation = useUpdateCourseCategory(courseId);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const { data: categories = [] } = useGetCategories();
  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const selectedOption = options.find((option) => option.value === defaultValues?.categoryId);

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
        <h3 className="border-b border-sky-500 font-semibold">カテゴリー</h3>
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
      {!isEditing && (
        <p className={cn("text-sm mt-2", !defaultValues?.categoryId && "text-slate-500")}>
          {selectedOption?.label || "カテゴリーが未登録です"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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
