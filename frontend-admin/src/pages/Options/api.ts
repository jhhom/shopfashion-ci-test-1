import { AdminProductOptionsRequests } from "@api-contract/admin-api/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { parseApiError } from "~/utils/api";
import toast from "react-hot-toast";
import { queryClient } from "~/providers/query";

export const QUERY_KEY = {
  product_options: "product_options",
  get_edited_product_option: "get_edited_product_option",
};

export function useCreateProductOption({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return useMutation({
    mutationFn: async (
      productOption: AdminProductOptionsRequests["createProductOption"]["body"]
    ) => {
      const r = await client.productOptions.createProductOption({
        body: productOption,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product option is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      onSuccess();
    },
    onError(e) {
      const err = createProductOptionApiErrorMessage(e);
      toast.error(err, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useListProductOptions(searchOptionName: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.product_options, searchOptionName],
    queryFn: async () => {
      const r = await client.productOptions.listProductOptions({
        query: {
          filter: {
            optionName: searchOptionName === "" ? null : searchOptionName,
          },
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

export function useEditedProductOption(productOptionCode: string) {
  return useQuery({
    queryKey: [QUERY_KEY.get_edited_product_option, productOptionCode],
    queryFn: async () => {
      const r = await client.productOptions.getProductOptionsForEdit({
        params: {
          optionCode: productOptionCode,
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

export function useEditProductOption(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arg: {
      optionCode: string;
      productOption: AdminProductOptionsRequests["editProductOption"]["body"];
    }) => {
      const r = await client.productOptions.editProductOption({
        params: { optionCode: arg.optionCode },
        body: arg.productOption,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess: () => {
      toast.success("Product option is updated successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.product_options],
      });
      onSuccess();
    },
    onError: (e) => {
      const message = editProductOptionApiErrorMessage(e);
      if (message) {
        toast.error(message, {
          position: "top-right",
          duration: 2000,
        });
      }
    },
  });
}

export function useDeleteProductOption() {
  return useMutation({
    mutationFn: async (optionCode: string) => {
      const r = await client.productOptions.deleteProductOption({
        params: {
          optionCode,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.product_options],
      });
      toast.success("Product option is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useDeleteProductOptionValue() {
  return useMutation({
    mutationFn: async (optionValueId: number) => {
      const r = await client.productOptions.deleteProductOptionValue({
        params: {
          optionValueId: optionValueId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product option value is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
    },
    onError(e) {
      console.log("🔥 ERR");
      console.log(e);
      const message = deleteProductOptionValueApiErrorMessage(e);
      if (message) {
        toast.error(message, {
          position: "top-right",
          duration: 2000,
        });
      }
    },
  });
}

const createProductOptionApiErrorMessage = (
  createProductOptionApiError: unknown
) => {
  const e = parseApiError(createProductOptionApiError);
  if (e.type === "application") {
    if (
      e.error.details.code ===
      "PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME"
    ) {
      return e.error.message;
    }
    return `An unexpected error had occured`;
  }
  return `An unexpected error had occured`;
};

const editProductOptionApiErrorMessage = (
  editProductOptionApiError: unknown
) => {
  const e = parseApiError(editProductOptionApiError);
  if (e.type === "application") {
    if (
      e.error.details.code ===
      "PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME"
    ) {
      return e.error.message;
    }
    return `An unexpected error had occured`;
  }
  return `An unexpected error had occured`;
};

const deleteProductOptionValueApiErrorMessage = (
  deleteProductOptionValueApiErrorMessage: unknown
) => {
  const e = parseApiError(deleteProductOptionValueApiErrorMessage);
  if (e.type === "application") {
    if (e.error.details.code === "DB_DELETED_ENTITY_IN_USE") {
      return `Unable to delete the option, it is currently in use by other products. You may delete those products first.`;
    }
  }

  return `An unexpected error had occured`;
};
