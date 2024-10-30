import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useUpdateCoursePrice } from "../../api/use-update-course-price";
import { formatPrice } from "@/lib/format-price";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  price: z.coerce
    .number()
    .int("価格は整数である必要があります")
    .min(0, "価格は0以上の整数である必要があります")
    .max(1000000, "価格は100万以下の整数である必要があります"),
});

type FormValues = z.input<typeof formSchema>;

interface CoursePriceFormProps {
  courseId: string;
  defaultValues?: FormValues;
}

export const CoursePriceForm = ({ courseId, defaultValues }: CoursePriceFormProps) => {
  const mutation = useUpdateCoursePrice(courseId);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const numericPrice = Number(values.price);
    mutation.mutate(
      { price: numericPrice },
      {
        onSuccess: (updatedCourse) => {
          toggleEdit();
          queryClient.setQueryData(["course", courseId], updatedCourse);
        },
      },
    );
  };

  return (
    <div className="rounded-md border p-4 shadow-md space-y-2">
      <div className="flex items-center justify-between font-medium">
        <h3 className="border-b border-sky-500 font-semibold">価格</h3>
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
        <p className={`mt-2 ${defaultValues?.price !== undefined ? "text-sm" : "text-xs text-muted-foreground"}`}>
          {defaultValues?.price !== undefined ? formatPrice(defaultValues.price) : "価格が未設定です"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={mutation.isPending}
                      placeholder="1000"
                      step="1"
                      type="number"
                      className="w-full rounded-md focus-visible:ring-slate-200"
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
