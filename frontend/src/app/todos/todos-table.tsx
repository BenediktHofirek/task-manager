"use client";
import { deleteTodo, getTodos, TodoSchema } from "@/api";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, Plus, SquarePen, Trash, X } from "lucide-react";
import Link from "next/link";

export default function TodosTable() {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isPending,
    isError,
  } = useSuspenseQuery({
    queryFn: ({ signal }) => getTodos({ signal }),
    queryKey: ["todos"],
  });

  const sortedTodos = todos.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const deleteTodoMutation = useMutation({
    mutationFn: (path: { id: number }) => deleteTodo({ path }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const todos: TodoSchema[] = queryClient.getQueryData(["todos"]) || [];
      const deletedTodo = todos.find((todo) => todo.id === id);

      queryClient.setQueryData(["todos"], (old: TodoSchema[]) => {
        return old.filter((item) => item.id !== id);
      });

      return { deletedTodo };
    },
    onError: (err, id, context) => {
      const deletedTodo = context?.deletedTodo;
      if (deletedTodo){
        queryClient.setQueryData(["todos"], (todos: TodoSchema[]) => todos.concat(deletedTodo));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate({ id });
  };

  if (isPending) return <div>Pending</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className="mx-auto block w-max overflow-x-auto rounded-xl shadow">
      <table className="border border-gray-200 text-xl">
        <thead className="bg-gray-100 text-left text-gray-700">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Completed</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">
              <Link
                href="/todos/new"
                className="block w-min cursor-pointer rounded-lg p-3 transition hover:bg-green-100
                  active:bg-green-200"
              >
                <Plus className="text-xl text-green-600" />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTodos.map((todo) => (
            <tr
              key={todo.id}
              className={cn(
                "group",
                todo.id < 0 ? "cursor-wait opacity-50" : "cursor-pointer",
              )}
            >
              <td className="px-4 py-2 font-medium">{todo.title}</td>
              <td className="px-4 py-2">{todo.description}</td>
              <td className="px-4 py-2">
                {todo.isCompleted ? (
                  <Check className="text-green-600" />
                ) : (
                  <X className="text-red-600" />
                )}
              </td>
              <td className="px-4 py-2">
                {todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "—"}
              </td>
              <td>
                <div
                  className={cn(
                    "flex items-center p-2 opacity-0",
                    todo.id > 0 && "group-hover:opacity-100",
                  )}
                >
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="block cursor-pointer rounded-lg p-3 transition hover:bg-red-100
                      active:bg-red-200"
                  >
                    <Trash className="text-xl text-red-500" />
                  </button>

                  <Link
                    href={`/todos/${todo.id}/edit`}
                    className="block w-min cursor-pointer rounded-lg p-3 transition hover:bg-blue-100
                      active:bg-blue-200"
                  >
                    <SquarePen className="text-xl text-blue-500" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
