import {
  StoreCustomersRequests,
  StoreProductsRequests,
} from "~/api-contract/store-api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { QUERY_KEY } from "~/pages/ProductListingByTaxon/query";
import toast from "react-hot-toast";

export function useProductListings(
  query: StoreProductsRequests["productsByTaxonSlug"]["query"]
) {
  return useQuery({
    queryKey: [QUERY_KEY.product_listing, JSON.stringify(query)],
    queryFn: async () => {
      const r = await client.products.productsByTaxonSlug({
        query,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useBreadcrumbs(taxonSlug: string) {
  return useQuery({
    queryKey: ["breadcrumbs", taxonSlug],
    queryFn: async () => {
      const r = await client.products.getProductListingsBreadcrumbs({
        query: {
          taxonSlug,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useTaxonTree(taxonSlug: string) {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_tree, taxonSlug],
    queryFn: async () => {
      const r = await client.products.productListingsTaxonTree({
        query: {
          taxonSlug,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}
