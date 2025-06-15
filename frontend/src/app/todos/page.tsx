import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import TodosTable from "./todos-table";
import { getTodos } from "@/api";

export default async function TodosPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodosTable />
    </HydrationBoundary>
  );
}
