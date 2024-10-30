import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateCourseSourceUrl } from "../../api/use-update-course-source-url";

const formSchema = z.object({
  sourceUrl: z.string().url("有効なURLを入力してください"),
});

type FormValues = z.input<typeof formSchema>;

interface CourseSourceUrlFormProps {
  courseId: string;
  defaultValues?: FormValues;
}

export const CourseSourceUrlForm = ({ courseId, defaultValues }: CourseSourceUrlFormProps) => {
  const mutation = useUpdateCourseSourceUrl(courseId);
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
        <h3 className="border-b border-sky-500 font-semibold">ソースコード</h3>
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
        <p className={`mt-2 text-sm ${!defaultValues?.sourceUrl ? "text-muted-foreground" : ""}`}>
          {defaultValues?.sourceUrl || "ソースコードが未登録です"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="sourceUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full rounded-md focus-visible:ring-slate-200"
                      disabled={mutation.isPending}
                      placeholder="https://souzocode.com/courses/1234567890"
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
