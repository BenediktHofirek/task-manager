import { getTodos } from "@/api";
import { client } from "@/api/client.gen";
import TodosTable from "./_components/todos-table";

export default async function Todos() {
  const { data: todos } = await getTodos({ client });

  if (!todos) {
    return <div>{"Sorry, an error happened"}</div>;
  }

  return (
    <TodosTable todos={todos} />
  );
}
