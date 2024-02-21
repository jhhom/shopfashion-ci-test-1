import { ProductType } from "@api-contract/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ShoppingCart/query";

export function useCartItemsInformation(args: {
  configurableItemsIds: number[];
  simpleItemsIds: number[];
}) {
  return useQuery({
    queryKey: [
      QUERY_KEY.cart_items,
      args.configurableItemsIds,
      args.simpleItemsIds,
    ],
    queryFn: async () => {
      const r = await client.products.getCartItemsInfo({
        body: {
          configurable: args.configurableItemsIds,
          simple: args.simpleItemsIds,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useCustomerCartItems() {
  return useQuery({
    queryKey: [QUERY_KEY.shopping_cart],
    queryFn: async () => {
      const r = await client.customers.getShoppingCart();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      productId: number;
      productType: ProductType;
    }) => {
      const r = await client.customers.removeCartItem({
        params: {
          productId: args.productId.toString(),
          productType: args.productType,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.shopping_cart],
      });
      toast.success("Item is removed from cart", {
        position: "top-center",
        duration: 2000,
      });
    },
  });
}

export function useSetCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      productId: number;
      quantity: number;
      productType: ProductType;
    }) => {
      const r = await client.customers.setCartItemQuantity({
        body: {
          quantity: args.quantity,
          type: args.productType,
        },
        params: {
          productId: args.productId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.shopping_cart],
      });
    },
  });
}
