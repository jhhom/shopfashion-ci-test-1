import { PurchaseStatusType } from "@api-contract/common";
import { StoreCustomersRequests } from "@api-contract/store-api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/Membership/query";
import { useAppStore } from "~/stores/stores";

export function useProfile() {
  const appStore = useAppStore();

  return useQuery({
    queryFn: async () => {
      if (!appStore.authenticated) {
        return { email: "" };
      }

      const result = await client.customers.customerMe();
      if (result.status !== 200) {
        throw result.body;
      }
      return result.body;
    },
    queryKey: ["customer_me"],
  });
}

export function usePurchases(status: PurchaseStatusType) {
  return useQuery({
    queryKey: [QUERY_KEY.list_purchases, status],
    queryFn: async () => {
      const r = await client.customers.listPurchases({
        params: {
          status,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useCreateProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      productId: number;
      review: StoreCustomersRequests["createProductReview"]["body"];
    }) => {
      const r = await client.customers.createProductReview({
        params: {
          productId: args.productId.toString(),
        },
        body: args.review,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product review is created successfully", {
        position: "top-center",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_purchases],
      });
    },
    onError(e) {
      toast.error("An unexpected error had occured", {
        position: "top-center",
        duration: 2000,
      });
    },
  });
}
