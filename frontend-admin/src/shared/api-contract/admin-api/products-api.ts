import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { zProductStatus, zProductType } from "../common";
import { zPagination, zPaginationMeta } from "./common";

const c = initContract();

export const productsApiContract = c.router({
  getOneProduct: {
    method: "GET",
    path: "/products/:productId",
    responses: {
      200: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        mainTaxonId: z.number().nullable(),
        productTaxonIds: z.array(z.number()),
        status: zProductStatus,
        availableAssociations: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
        productAssociations: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
        imageUrl: z.string().nullable(),
        product: z.discriminatedUnion("type", [
          z.object({
            type: z.literal("SIMPLE"),
            pricing: z.number(),
          }),
          z.object({
            type: z.literal("CONFIGURABLE"),
            productOptions: z.array(
              z.object({
                code: z.string(),
                name: z.string(),
              })
            ),
          }),
        ]),
      }),
    },
  },

  listProducts: {
    method: "GET",
    path: "/products",
    query: z.object({
      filter: z.object({
        productName: z.string().nullable(),
        taxonId: z.number().nullable(),
        status: zProductStatus.nullable(),
      }),
      pagination: zPagination.optional(),
    }),
    responses: {
      200: z.object({
        results: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            type: zProductType,
            status: zProductStatus,
          })
        ),
        paginationMeta: zPaginationMeta,
      }),
    },
  },

  deleteProduct: {
    method: "DELETE",
    body: null,
    path: "/products/:productId",
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  deleteManyProducts: {
    method: "DELETE",
    body: z.object({
      productIds: z.array(z.number()),
    }),
    path: "/products",
    responses: { 200: z.object({ message: z.string() }) },
  },

  createSimpleProduct: {
    method: "POST",
    body: z.object({
      name: z.string(),
      description: z.string(),
      pricing: z.number(),
      mainTaxonId: z.number(),
      productTaxonIds: z.array(z.number().int()),
      productAssociations: z.array(z.number().int()),
      status: zProductStatus,
      imageBase64: z.string().nullable(),
    }),
    path: "/products/simple",
    responses: { 200: z.object({ message: z.string() }) },
  },

  createConfigurableProduct: {
    method: "POST",
    path: "/products/configurable",
    body: z.object({
      name: z.string(),
      description: z.string(),
      mainTaxonId: z.number(),
      productOptionCodes: z
        .array(z.string())
        .refine(
          (x) => x.length > 0,
          "There must be at least one product option for a configurable product"
        ),
      productTaxonIds: z.array(z.number().int()),
      productAssociations: z.array(z.number().int()),
      status: zProductStatus,
      imageBase64: z.string().nullable(),
    }),
    responses: { 200: z.object({ message: z.string() }) },
  },

  editSimpleProduct: {
    method: "PUT",
    path: "/products/:productId/simple",
    body: z.object({
      name: z.string(),
      description: z.string(),
      pricing: z
        .number()
        .refine((p) => Number(p) >= 0, "Pricing must be 0 or positive"),
      mainTaxonId: z.number(),
      productTaxonIds: z.array(z.number().int()),
      productAssociations: z.array(z.number().int()),
      status: zProductStatus,
      imageBase64: z.string().nullable(),
      removeImage: z.boolean().nullable(),
    }),
    responses: { 200: z.object({ message: z.string() }) },
  },

  editConfigurableProduct: {
    method: "PUT",
    path: "/products/:productId/configurable",
    body: z.object({
      name: z.string(),
      description: z.string(),
      mainTaxonId: z.number(),
      productTaxonIds: z.array(z.number().int()),
      productAssociations: z.array(z.number().int()),
      status: zProductStatus,
      imageBase64: z.string().nullable(),
      removeImage: z.boolean().nullable(),
    }),
    responses: { 200: z.object({ message: z.string() }) },
  },
});

export const productAssociationsApiContract = c.router({
  listAssociationTypes: {
    method: "GET",
    path: "/product_association_types",
    query: z.object({
      filter: z.object({
        name: z.string().nullable(),
      }),
    }),
    responses: {
      200: z.object({
        results: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
      }),
    },
  },

  getOneAssociationType: {
    method: "GET",
    path: "/product_association_types/:associationTypeId",
    responses: {
      200: z.object({
        id: z.number(),
        name: z.string(),
      }),
    },
  },

  createAssociationType: {
    method: "POST",
    path: "/product_association_types",
    body: z.object({
      name: z.string().min(1),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  editAssociationType: {
    method: "PUT",
    path: "/product_association_types/:associationTypeId",
    body: z.object({
      name: z.string().min(1),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  deleteAssociationType: {
    method: "DELETE",
    path: "/product_association_types/:associationTypeId",
    body: null,
    responses: {
      200: z.object({ message: z.string() }),
    },
  },
});
