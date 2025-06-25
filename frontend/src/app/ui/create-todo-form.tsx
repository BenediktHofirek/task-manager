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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, TodoCreateSchema } from "@/api";
import { useRouter } from "next/navigation";

const today = new Date();
const todayDateOnly = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
);

const taskSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().optional(),
  dueDate: z
    .date()
    .optional()
    .refine((inputDate) => {
      if (!inputDate) {
        return true;
      }

      return inputDate >= todayDateOnly;
    }, "Due date must be today or later"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function CreateTodoForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createTodoMutation = useMutation({
    mutationFn: (dto: TodoCreateSchema) => createTodo({ 
      body: dto,
    }),
    mutationKey: ["createTodo"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    createTodoMutation.mutate({
      ...data,
      dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : null,
    });
    router.push("/todos");
  };

  const onClose = () => {
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

        <div className="flex justify-end gap-4 text-base">
          <Button
            type="button"
            variant={"secondary"}
            className="cursor-pointer text-base"
            onClick={onClose}
          >
            Go back
          </Button>
          <Button type="submit" className="cursor-pointer">
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
