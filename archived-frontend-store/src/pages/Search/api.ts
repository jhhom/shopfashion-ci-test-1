import { useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";

export function useProductSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (searchTerm === "") {
        return [];
      }

      const r = await client.products.searchProducts({
        params: { searchTerm },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}
