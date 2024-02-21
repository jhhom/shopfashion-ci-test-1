import {
  StoreCustomersRequests,
  StoreProductsRequests,
} from "~/api-contract/store-api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ProductDetails/query";
import toast from "react-hot-toast";

export function useProductDetails(productId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.product_details, productId],
    queryFn: async () => {
      const r = await client.products.getOneProduct({
        params: { productId: productId.toString() },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useBreadcrumbs(
  productId: number,
  fromTaxon: string | undefined
) {
  return useQuery({
    queryKey: ["breadcrumbs", productId, fromTaxon],
    queryFn: async () => {
      const r = await client.products.getProductDetailsBreadcrumbs({
        params: {
          productId: productId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useAddtoCart() {
  return useMutation({
    mutationFn: async (
      item: StoreCustomersRequests["customerAddToCart"]["body"]
    ) => {
      const r = await client.customers.customerAddToCart({
        body: item,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Item added to cart", {
        position: "top-center",
        duration: 2000,
      });
    },
  });
}
