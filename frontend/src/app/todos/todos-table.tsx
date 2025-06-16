"use client";
import { deleteTodo, getTodos, TodoSchema } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";

export default function TodosTable() {
  const queryClient = useQueryClient();

  const {
    data: todos,
    isPending,
    isError,
  } = useQuery({
    queryFn: () => getTodos(),
    queryKey: ["todos"],
  });

  const handleAddTodo = () => {
    console.log("Adding todo");
  };

  const deleteTodoMutation = useMutation({
    mutationFn: (path: { id: number }) => deleteTodo({ path }),
    onMutate: async ({ id }) => {
      console.log("deleting", id);

      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);

      queryClient.setQueryData(["todos"], (old: TodoSchema[]) => {
        return old.filter((item) => item.id !== id);
      });

      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
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
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Completed</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">
              <Link
                href="/todos/new"
                className="block cursor-pointer rounded-lg p-4 transition hover:bg-gray-200
                  active:bg-gray-300"
              >
                <Plus className="text-xl text-green-600" />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td className="px-4 py-2">{todo.id}</td>
              <td className="px-4 py-2 font-medium">{todo.title}</td>
              <td className="px-4 py-2">{todo.description}</td>
              <td className="px-4 py-2">
                <DynamicIcon
                  className={
                    todo.isCompleted ? "text-green-600" : "text-red-500"
                  }
                  name={todo.isCompleted ? "check" : "x"}
                  size="2rem"
                ></DynamicIcon>
              </td>
              <td className="px-4 py-2">{todo.dueDate?.toString() || "—"}</td>
              <td>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="block cursor-pointer rounded-lg p-4 transition hover:bg-red-100
                    active:bg-red-200"
                >
                  <X className="text-xl text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
