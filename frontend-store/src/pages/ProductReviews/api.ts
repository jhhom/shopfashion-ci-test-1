import {
  StoreCustomersRequests,
  StoreProductsRequests,
} from "~/api-contract/store-api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ProductListingByTaxon/query";
import toast from "react-hot-toast";

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["all_product_reviews", productId],
    queryFn: async () => {
      const r = await client.products.listProductReviews({
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
