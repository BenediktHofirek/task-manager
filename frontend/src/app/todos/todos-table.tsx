"use client";
import { uniqBy } from "es-toolkit";
import { deleteTodo, getTodos, TodoSchema } from "@/api";
import { cn } from "@/lib/utils";
import {
  useMutation,
  useMutationState,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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

  const createdTodos = useMutationState<TodoSchema>({
    filters: { mutationKey: ["createTodo"], status: "pending" },
    select: (mutation) => ({
      ...(mutation.state.variables as TodoSchema),
      // negative integer is used to distinguish optimistic create
      id: mutation.state.submittedAt * -1,
      // +1e6 to make initial sort by createdAt work no matter how long the server response take
      // and how many new entries user might create in the meantime
      createdAt: new Date(mutation.state.submittedAt + 1e6).toISOString(),
    }),
  });

  const editedTodos = useMutationState<TodoSchema>({
    filters: { mutationKey: ["editTodo"], status: "pending" },
    select: (mutation) => mutation.state.variables as TodoSchema,
  });

  const deletedTodoIds = useMutationState<number>({
    filters: { mutationKey: ["deleteTodo"], status: "pending" },
    select: (mutation) => (mutation.state.variables as { id: number }).id,
  });

  const mergedEditedTodos = editedTodos.map((editedTodo) => ({
    ...todos.find((todo) => todo.id === editedTodo.id),
    ...editedTodo,
  }));

  const joinedTodos = mergedEditedTodos.concat(todos).concat(createdTodos);
  const filteredTodos = joinedTodos.filter(
    (todo) => !deletedTodoIds.includes(todo.id),
  );
  const uniqueTodos = uniqBy(filteredTodos, (todo) => todo.id);
  const sortedTodos = uniqueTodos.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const deleteTodoMutation = useMutation({
    mutationFn: (path: { id: number }) =>
      deleteTodo({
        path,
      }),
    mutationKey: ["deleteTodo"],
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
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
