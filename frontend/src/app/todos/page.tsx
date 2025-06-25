import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import TodosTable from "./todos-table";
import { getTodos } from "@/api";
import { withAuthToken } from "@/lib/utils";
import { connection } from "next/server";

export default async function TodosPage() {
  await connection();
  const queryClient = getQueryClient();

  // must run server-side
  const prefetchQueryFn = await withAuthToken(getTodos);

  console.log('called')
  queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: ({ signal }) => prefetchQueryFn({ signal }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodosTable />
    </HydrationBoundary>
  );
}
