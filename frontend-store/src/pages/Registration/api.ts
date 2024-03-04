import {
  StoreCustomersRequests,
  StoreProductsRequests,
} from "~/api-contract/store-api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ProductListingByTaxon/query";

import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export function useRegister({ onError }: { onError: () => void }) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (
      credentials: StoreProductsRequests["registerCustomer"]["body"]
    ) => {
      const r = await client.products.registerCustomer({
        body: credentials,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Account created successfully", {
        position: "top-center",
        duration: 2000,
      });
      navigate({ to: "/login" });
    },
    onError() {
      onError();
    },
  });
}
