import { StoreCustomersRequests } from "~/api-contract/store-api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ProductListingByTaxon/query";

import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { DeliveryFormSchema } from "~/pages/Checkout/components/delivery-form";

export function useCheckoutInfo() {
  return useQuery({
    queryKey: ["checkout_info"],
    queryFn: async () => {
      const r = await client.customers.getCheckoutInfo();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    staleTime: 0,
  });
}

export function useCheckoutSession({
  onSuccess,
}: {
  onSuccess: (args: { deliveryAddress: DeliveryFormSchema }) => void;
}) {
  return useMutation({
    mutationFn: async (deliveryAddress: DeliveryFormSchema) => {
      const r = await client.customers.requestCheckoutSession({
        body: {
          deliveryAddress,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return {
        ...r.body,
        deliveryAddress,
      };
    },
    onSuccess(data, variables, context) {
      onSuccess({ deliveryAddress: data.deliveryAddress });
    },
  });
}
