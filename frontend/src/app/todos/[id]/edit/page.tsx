import { getTodoById } from "@/api";
import { getQueryClient } from "@/app/get-query-client";
import { EditTodoForm } from "@/app/ui/edit-todo-form";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = getQueryClient();
  const { id } = await params;
  const editedTodoId = Number(id);

  if (!Number.isInteger(editedTodoId)) {
    return <div>Invalid todo id: {id}</div>;
  }

  await queryClient.prefetchQuery({
    queryKey: ["todos", editedTodoId],
    queryFn: () => getTodoById({ path: { id: editedTodoId } }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditTodoForm id={editedTodoId} />
    </HydrationBoundary>
  );
}
