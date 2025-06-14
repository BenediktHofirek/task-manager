import { getTodoById} from "@/api";
import { client } from "@/api/client.gen";

export default async function Todos() {
  const { data: todo, error } = await getTodoById({
    client: client,
    path: {
      id: 1,
    },
  });

  return (
    <>
      <div>Hello todos</div>
      <div>{todo?.title}</div>
    </>
  );
}
