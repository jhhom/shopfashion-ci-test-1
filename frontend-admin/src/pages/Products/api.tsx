import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";

import toast from "react-hot-toast";
import {
  AdminProductOptionsResponse,
  AdminProductVariantRequests,
  AdminProductVariantResponse,
  AdminProductsRequests,
} from "@api-contract/admin-api/types";
import { parseApiError } from "~/utils/api";
import { Pagination } from "@api-contract/common";
import { PaginationParameters } from "~/utils/pagination";
import { useEffect } from "react";

export const QUERY_KEY = {
  list_products: "list_products",
  list_product_variants: "list_product_variants",
  product_options: "product_options",
  get_edited_product: "get_edited_product",
  get_product_configurable_options: "get_product_configurable_options",
  get_edited_product_variant: "get_edited_product_variant",
  generate_product_variants: "generate_product_variants",
  taxon_parents: "taxon_parents",
  taxon_tree: "taxon_tree",
  list_association_types: "list_association_types",
};

export function useTaxonParents() {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_parents],
    queryFn: async () => {
      const r = await client.taxons.assignableTaxonParents();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useTaxonTree() {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_tree],
    queryFn: async () => {
      const r = await client.taxons.taxonTree();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useCreateConfigurableProduct({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      product: AdminProductsRequests["createConfigurableProduct"]["body"]
    ) => {
      const r = await client.products.createConfigurableProduct({
        body: product,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_products],
      });
      onSuccess();
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useCreateSimpleProduct({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      product: AdminProductsRequests["createSimpleProduct"]["body"]
    ) => {
      const r = await client.products.createSimpleProduct({
        body: product,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_products],
      });
      onSuccess();
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useProductConfigurableOptions(
  productId: number,
  onSuccess: (
    result: AdminProductOptionsResponse["getProductConfigurableOptionsAndValues"]["body"]
  ) => void
) {
  const query = useQuery({
    queryKey: [QUERY_KEY.get_product_configurable_options, productId],
    queryFn: async () => {
      const r =
        await client.productOptions.getProductConfigurableOptionsAndValues({
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

  useEffect(() => {
    if (query.isSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, onSuccess, query.data]);

  return query;
}

export function useCreateProductVariant({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useMutation({
    mutationFn: async (
      productVariant: AdminProductVariantRequests["createProductVariant"]["body"]
    ) => {
      const r = await client.productVariants.createProductVariant({
        body: productVariant,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product variant is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      onSuccess();
    },
    onError(e) {
      const err = parseApiError(e);

      const message =
        err.type === "application" &&
        err.error.details.code === "PRODUCT_VARIANT.CONFLICT_OPTION_VALUES"
          ? err.error.message
          : "An unexpected error had occured";

      toast.error(message, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useCustomerDetails(customerId: number) {
  return useQuery({
    queryKey: ["customer_details", customerId],
    queryFn: async () => {
      const r = await client.customers.customerDetails({
        params: {
          customerId: customerId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return {
        ...r.body,
        orders: r.body.orders.map((o) => ({
          ...o,
          date: new Date(o.date),
        })),
        customerSince: new Date(r.body.customerSince),
      };
    },
    staleTime: 0,
  });
}

type EditProductArg =
  | (AdminProductsRequests["editSimpleProduct"]["body"] & { type: "SIMPLE" })
  | (AdminProductsRequests["editConfigurableProduct"]["body"] & {
      type: "CONFIGURABLE";
    });

export function useEditProduct({
  productId,
  onSuccess,
}: {
  productId: number;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: EditProductArg) => {
      if (product.type === "SIMPLE") {
        const r = await client.products.editSimpleProduct({
          params: { productId: productId.toString() },
          body: product,
        });
        if (r.status !== 200) {
          throw r.body;
        }
        return r.body;
      } else {
        const r = await client.products.editConfigurableProduct({
          params: { productId: productId.toString() },
          body: product,
        });
        if (r.status !== 200) {
          throw r.body;
        }
        return r.body;
      }
    },
    onSuccess() {
      toast.success("Product is updated successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_products],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.get_edited_product, productId],
      });
      onSuccess();
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useEditedProductInfo(productId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.get_edited_product, productId],
    queryFn: async () => {
      const r = await client.products.getOneProduct({
        params: {
          productId: productId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    staleTime: 0,
  });
}

export function useEditProductVariant({
  onSuccess,
  productVariantId,
}: {
  onSuccess: () => void;
  productVariantId: number;
}) {
  return useMutation({
    mutationFn: async (
      values: AdminProductVariantRequests["editProductVariant"]["body"]
    ) => {
      const r = await client.productVariants.editProductVariant({
        params: {
          productVariantId: productVariantId.toString(),
        },
        body: values,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product variant is updated successfully", {
        position: "top-right",
        duration: 2000,
      });
      onSuccess();
    },
    onError(e) {
      const err = parseApiError(e);
      const message =
        err.type === "application" &&
        err.error.details.code === "PRODUCT_VARIANT.CONFLICT_OPTION_VALUES"
          ? `Unable to create product variant. Another variant "${err.error.details.info.variant}" has the same set of options`
          : "An unexpected error had occured";

      toast.error(message, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useEditedProductVariantInfo(
  productVariantId: number,
  onSuccess: (
    result: AdminProductVariantResponse["getProductVariantForEdit"]["body"]
  ) => void
) {
  const query = useQuery({
    queryKey: [QUERY_KEY.get_edited_product_variant, productVariantId],
    queryFn: async () => {
      const r = await client.productVariants.getProductVariantForEdit({
        params: {
          productVariantId: productVariantId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (query.isSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  return query;
}

export function useGenerateVariants(productId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.generate_product_variants, productId],
    queryFn: async () => {
      const r = await client.productVariants.generateProductVariants({
        params: {
          productId: productId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }

      return r.body;
    },
    staleTime: 0,
  });
}

export function useSaveGeneratedVariants({
  productId,
  onSuccess,
}: {
  productId: number;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      values: AdminProductVariantRequests["saveGeneratedProductVariants"]["body"]
    ) => {
      const r = await client.productVariants.saveGeneratedProductVariants({
        params: {
          productId: productId.toString(),
        },
        body: values,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_product_variants, productId],
      });

      toast.success("Generated product variants are saved successfully", {
        position: "top-right",
        duration: 2000,
      });
      onSuccess();
    },
    onError(e) {
      const message = generateProductVariantApiErrorMessage(e);
      if (message) {
        toast.error(message, {
          position: "top-right",
          duration: 5000,
        });
      }
    },
  });
}

export function useProductListings({
  pagination,
  filterProductName,
  taxonId,
}: {
  pagination: PaginationParameters;
  filterProductName: string;
  taxonId: number | null;
}) {
  return useQuery({
    queryKey: [
      QUERY_KEY.list_products,
      JSON.stringify(pagination),
      filterProductName,
      taxonId,
    ],
    queryFn: async () => {
      const r = await client.products.listProducts({
        query: {
          filter: {
            status: null,
            productName: filterProductName,
            taxonId,
          },
          pagination,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const r = await client.products.deleteProduct({
        params: { productId: productId.toString() },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.list_products] });
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productIds: number[]) => {
      const r = await client.products.deleteManyProducts({
        body: {
          productIds,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Products are deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.list_products] });
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useProductVariantListings({
  productId,
  searchVariantName,
}: {
  productId: number;
  searchVariantName: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEY.list_product_variants, productId, searchVariantName],
    queryFn: async () => {
      const r = await client.productVariants.listProductVariants({
        params: {
          productId: productId.toString(),
        },
        query: {
          filter: {
            variantName: searchVariantName === "" ? null : searchVariantName,
          },
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productVariantId: number) => {
      const r = await client.productVariants.deleteProductVariant({
        params: {
          productVariantId: productVariantId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product variant is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_product_variants],
      });
    },
    onError(e) {
      toast.error(
        `Unable to delete product variant. An unexpected error has occured.`,
        {
          position: "top-right",
          duration: 2000,
        }
      );
    },
  });
}

export function useProductDetails(productId: number) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const r = await client.products.getOneProduct({
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

const generateProductVariantApiErrorMessage = (
  generateProductVariantApiError: unknown
) => {
  const e = parseApiError(generateProductVariantApiError);
  if (e.type === "application") {
    if (
      e.error.details.code === "PRODUCT_VARIANT.MULTI_CONFLICT_OPTION_VALUES"
    ) {
      return (
        <div>
          <p>
            Unable to save product variants. Following variants have the same
            set of options:
          </p>
          <ul className="mt-4 list-inside list-disc">
            {e.error.details.info.variants.map((vs) => (
              <li key={vs.join("-")}>{vs.join(", ")}</li>
            ))}
          </ul>
        </div>
      );
    }
    if (e.error.details.code === "PRODUCT_VARIANT.CONFLICT_VARIANT_NAMES") {
      return `Unable to save product variants, the variant names ${e.error.details.info.names.join(
        ", "
      )} are used multiple times.`;
    }
    return `An unexpected error had occured`;
  }
  return `An unexpected error had occured`;
};
