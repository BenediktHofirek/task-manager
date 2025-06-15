"use client";
import { getTodos } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function TodosTable() {
  const { data: todos, isPending, isError } = useQuery({
    queryFn: () => getTodos(),
    queryKey: ['todos']
  });

  const addTodo = () => {
    console.log("Adding todo");
  };

  const deleteTodo = (id: number) => {
    console.log('Delete todo', id);
  }

  if (isPending) return <div>Pending</div>

  if (isError) return <div>Error</div>

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
              <button
                onClick={() => addTodo()}
                className="block cursor-pointer rounded-lg p-4 hover:bg-gray-200 active:bg-gray-300 transition"
              >
                <Plus className="text-xl text-green-600" />
              </button>
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
                  onClick={() => deleteTodo(todo.id)}
                  className="block cursor-pointer rounded-lg p-4 hover:bg-red-100 active:bg-red-200 transition"
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
