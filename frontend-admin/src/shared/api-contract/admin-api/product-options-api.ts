import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const productOptionsApiContract = c.router({
  getProductConfigurableOptionsAndValues: {
    method: "GET",
    path: "/products/:productId/product_option_values",
    responses: {
      200: z.object({
        productName: z.string(),
        configurableOptions: z.array(
          z.object({
            optionCode: z.string(),
            optionName: z.string(),
            optionValues: z.array(
              z.object({
                id: z.number(),
                value: z.string(),
              })
            ),
          })
        ),
      }),
    },
  },

  listProductOptions: {
    method: "GET",
    path: "/product_options",
    query: z.object({
      filter: z
        .object({
          optionName: z.string().nullable(),
        })
        .optional(),
    }),
    responses: {
      200: z.array(
        z.object({
          code: z.string(),
          name: z.string(),
          position: z.number(),
        })
      ),
    },
  },

  getProductOptionsForEdit: {
    method: "GET",
    path: "/product_options/:optionCode/edit",
    responses: {
      200: z.object({
        optionName: z.string(),
        position: z.number(),
        values: z.array(
          z.object({
            id: z.number(),
            value: z.string(),
          })
        ),
      }),
    },
  },

  createProductOption: {
    method: "POST",
    path: "/product_options",
    body: z.object({
      code: z.string(),
      name: z.string(),
      position: z.number().nullable(),
      productOptionValues: z.array(z.string()),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  editProductOption: {
    method: "PUT",
    path: "/product_options/:optionCode",
    body: z.object({
      name: z.string(),
      position: z.number().nullable(),
      editedProductOptionValues: z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
        })
      ),
      newProductOptionValues: z.array(z.string()),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  deleteProductOption: {
    method: "DELETE",
    path: "/product_options/:optionCode",
    body: null,
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  deleteProductOptionValue: {
    method: "DELETE",
    path: "/product_option_values/:optionValueId",
    body: null,
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
});
