import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "~/pages/layouts/query";

import { client } from "~/external/api-client/client";
import { StoreProductsRequests } from "~/api-contract/store-api/api";

export function useTaxonTree() {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_tree],
    queryFn: async () => {
      const r = await client.products.taxonTree();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useSearchAutocomplete(searchTerm: string) {
  return useQuery({
    queryKey: ["search_products_autocomplete", searchTerm],
    queryFn: async () => {
      if (searchTerm === "") {
        return {
          productNames: [],
        };
      }

      const r = await client.products.searchProductAutocomplete({
        params: { searchTerm },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useCustomerLogin({
  onSuccess,
  onError,
}: {
  onSuccess: (token: string) => void;
  onError: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (
      credentials: StoreProductsRequests["customerLogin"]["body"]
    ) => {
      const r = await client.products.customerLogin({ body: credentials });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess: ({ token }) => {
      onSuccess(token);
    },
    onError: (e) => {
      onError(e);
    },
  });
}

export function useCustomerVerifyToken({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: async () => {
      const r = await client.customers.customerVerifyToken();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (e) => {
      onError(e);
    },
  });
}
