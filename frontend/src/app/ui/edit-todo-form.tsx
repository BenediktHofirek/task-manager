"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays as CalendarIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodoById, TodoSchema, TodoUpdateSchema, updateTodo } from "@/api";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const taskSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  isCompleted: z.boolean(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function EditTodoForm({ id: editedTodoId }: { id: number }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const cachedTodo = queryClient
    .getQueryData<TodoSchema[]>(["todos"])
    ?.find((todo) => todo.id === editedTodoId);
  const {
    data: editedTodo,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos", editedTodoId],
    queryFn: () =>
      cachedTodo
        ? Promise.resolve(cachedTodo)
        : getTodoById({ path: { id: editedTodoId } }),
    staleTime: 0,
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & TodoUpdateSchema) =>
      updateTodo({
        body,
        path: { id },
      }),
    mutationKey: ["editTodo"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      isCompleted: undefined,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (editedTodo) {
      reset({
        title: editedTodo.title,
        description: editedTodo.description,
        dueDate: editedTodo.dueDate ? new Date(editedTodo.dueDate) : undefined,
        isCompleted: editedTodo.isCompleted,
      });
    }
  }, [editedTodo, reset]);

  if (isPending) return <div>Fetching data</div>;
  if (isError) return <div>An error occurred</div>;

  const onSubmit = (data: TaskFormValues) => {
    updateTodoMutation.mutate({
      ...data,
      id: editedTodoId,
      dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : null,
    });
    router.push("/todos");
  };

  const onCancel = () => {
    router.push("/todos");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Details about the task..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"}>
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Completed */}
        <FormField
          control={form.control}
          name="isCompleted"
          render={({ field }) => (
            <FormItem className="flex w-max flex-row items-center justify-start gap-3 rounded-lg p-3 shadow-sm">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Is Completed</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 text-base">
          <Button
            type="button"
            variant={"secondary"}
            className="cursor-pointer text-base"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
