import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import TodosTable from "./todos-table";
import { getTodos } from "@/api";
import { connection } from "next/server";
import { withAuthToken } from "@/lib/auth0";

export default async function TodosPage() {
  await connection();
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: ({ signal }) =>
      withAuthToken(getTodos, {
        signal,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodosTable />
    </HydrationBoundary>
  );
}
