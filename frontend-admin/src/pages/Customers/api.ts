import { useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { PaginationParameters } from "~/utils/pagination";

export const QUERY_KEY = {
  list_customers: "list_customers",
};

export function useCustomers(
  pagination: PaginationParameters,
  searchEmail: string
) {
  return useQuery({
    queryKey: [
      QUERY_KEY.list_customers,
      JSON.stringify(pagination),
      searchEmail,
    ],
    queryFn: async () => {
      const r = await client.customers.customers({
        query: {
          filter: {
            email: searchEmail,
          },
          pagination,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      console.log("R BODY", r.body);
      return r.body;
    },
  });
}
