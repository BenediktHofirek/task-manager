import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import TodosTable from "./todos-table";
import { getTodos } from "@/api";
import { auth0 } from "@/lib/auth0";

export default async function TodosPage() {
  const queryClient = getQueryClient();
  const { token: authToken } = await auth0.getAccessToken();

  console.log("accessToken", authToken);

  queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: ({ signal }) =>
      getTodos({
        signal,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodosTable />
    </HydrationBoundary>
  );
}
