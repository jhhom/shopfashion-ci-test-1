import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { zProductStatus } from "../common";

const c = initContract();

export const productVariantsApiContract = c.router({
  getProductVariantForEdit: {
    method: "GET",
    path: "/product_variants/:productVariantId/edit",
    responses: {
      200: z.object({
        productName: z.string(),
        productVariantName: z.string(),
        pricing: z.number(),
        status: zProductStatus,
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
            currentValueId: z.number(),
          })
        ),
      }),
    },
  },

  createProductVariant: {
    method: "POST",
    path: "/product_variants",
    body: z.object({
      productId: z.number(),
      variantName: z.string(),
      pricing: z.number(),
      status: zProductStatus,
      options: z.array(
        z.object({
          optionCode: z.string(),
          optionValueId: z.number(),
        })
      ),
      imageBase64: z.string().nullable(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  editProductVariant: {
    method: "PUT",
    path: "/product_variants/:productVariantId",
    body: z.object({
      productId: z.number(),
      pricing: z.number(),
      status: zProductStatus,
      variantName: z.string(),
      options: z.array(
        z.object({
          optionCode: z.string(),
          optionValueId: z.number(),
        })
      ),
      imageBase64: z.string().nullable().optional(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  deleteProductVariant: {
    method: "DELETE",
    path: "/product_variants/:productVariantId",
    body: null,
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  listProductVariants: {
    method: "GET",
    path: "/products/:productId/product_variants",
    query: z.object({
      filter: z
        .object({
          variantName: z.string().nullable(),
        })
        .optional(),
    }),
    responses: {
      200: z.object({
        productName: z.string(),
        variants: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            position: z.number(),
            optionValues: z.string(),
          })
        ),
      }),
    },
  },

  generateProductVariants: {
    method: "GET",
    path: "/products/:productId/product_variants/generate",
    responses: {
      200: z.object({
        productName: z.string(),
        configurableOptions: z.array(
          z.object({
            code: z.string(),
            name: z.string(),
            values: z.array(
              z.object({
                id: z.number(),
                value: z.string(),
              })
            ),
          })
        ),
        existingProductVariants: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            options: z.array(
              z.object({
                code: z.string(),
                valueId: z.number(),
              })
            ),
          })
        ),
        generatedProductVariants: z.array(
          z.object({
            name: z.string(),
            options: z.array(
              z.object({
                code: z.string(),
                valueId: z.number(),
              })
            ),
          })
        ),
      }),
    },
  },

  saveGeneratedProductVariants: {
    method: "POST",
    path: "/products/:productId/product_variants/generate",
    body: z.object({
      existingProductVariants: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          options: z.array(
            z.object({
              code: z.string(),
              valueId: z.number(),
            })
          ),
        })
      ),
      generatedProductVariants: z.array(
        z.object({
          name: z.string(),
          options: z.array(
            z.object({
              code: z.string(),
              valueId: z.number(),
            })
          ),
        })
      ),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
});
