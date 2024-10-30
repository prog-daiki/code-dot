import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは1文字以上です")
    .max(100, "タイトルは100文字以内です"),
});

type FormValues = z.input<typeof formSchema>;

interface CourseCreateFormProps {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
}

export const CourseCreateForm = ({
  defaultValues,
  onSubmit,
  disabled,
}: CourseCreateFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input
                  className="w-full rounded-md focus-visible:ring-slate-200"
                  disabled={disabled}
                  placeholder="ReactでTodoアプリを作ろう"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          講座を作成
        </Button>
      </form>
    </Form>
  );
};
