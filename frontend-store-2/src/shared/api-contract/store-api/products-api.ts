import { zProductStatus, zTaxon } from "../common";

import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const productsApiContract = c.router({
  registerCustomer: {
    method: "POST",
    path: "/register_customer",
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },

  searchProductAutocomplete: {
    method: "GET",
    path: "/search_product_autocomplete/:searchTerm",
    responses: {
      200: z.object({
        productNames: z.array(z.string()),
      }),
    },
  },

  getProductDetailsBreadcrumbs: {
    method: "GET",
    path: "/breadcrumbs/product_details/:productId",
    query: z.object({
      comingFromTaxon: z.string().optional(),
    }),
    responses: {
      200: z.object({
        crumbs: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
          })
        ),
        productName: z.string(),
      }),
    },
  },

  getProductListingsBreadcrumbs: {
    method: "GET",
    path: "/breadcrumbs/product_listings",
    query: z.object({
      taxonSlug: z.string(),
    }),
    responses: {
      200: z.object({
        precedingSlugs: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
          })
        ),
        lastSlug: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .nullable(),
      }),
    },
  },

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
        associations: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            otherProducts: z.array(
              z.object({
                name: z.string(),
                id: z.number(),
                imgUrl: z.string().nullable(),
                pricing: z.number(),
              })
            ),
          })
        ),
        productImageUrl: z.string().nullable(),
        rating: z.number(),
        numberOfReviews: z.number(),
        first3Reviews: z.array(
          z.object({
            customerEmail: z.string(),
            comment: z.string(),
            rating: z.number(),
            createdAt: z.string(),
          })
        ),
        product: z.discriminatedUnion("type", [
          z.object({
            type: z.literal("SIMPLE"),
            pricing: z.number(),
          }),
          z.object({
            type: z.literal("CONFIGURABLE"),
            variants: z.array(
              z.object({
                id: z.number(),
                optionValues: z.array(
                  z.object({
                    optionCode: z.string(),
                    optionValueId: z.number(),
                  })
                ),
                status: zProductStatus,
                pricing: z.number(),
              })
            ),
            productOptions: z.array(
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
          }),
        ]),
      }),
    },
  },

  listProductReviews: {
    method: "GET",
    path: "/product_reviews/:productId",
    responses: {
      200: z.object({
        product: z.object({
          name: z.string(),
          rating: z.number(),
          imageUrl: z.string().nullable(),
        }),
        reviews: z.array(
          z.object({
            customerEmail: z.string(),
            comment: z.string(),
            rating: z.number(),
            createdAt: z.string(),
          })
        ),
      }),
    },
  },

  taxonTree: {
    method: "GET",
    path: "/taxon_tree",
    responses: {
      200: z.array(zTaxon),
    },
  },

  productListingsTaxonTree: {
    method: "GET",
    path: "/product_listings_taxon_tree",
    query: z.object({
      taxonSlug: z.string(),
    }),
    responses: {
      200: z.array(zTaxon),
    },
  },

  rootTaxons: {
    method: "GET",
    path: "/root_taxons",
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          taxonName: z.string(),
          slug: z.string(),
        })
      ),
    },
  },

  searchProducts: {
    method: "GET",
    path: "/search_products/:searchTerm",
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          imgUrl: z.string().nullable(),
          name: z.string(),
          status: zProductStatus,
          rating: z.number(),
          numberOfReviews: z.number(),
          pricing: z.discriminatedUnion("type", [
            z.object({
              type: z.literal("SIMPLE"),
              price: z.number(),
            }),
            z.object({
              type: z.literal("CONFIGURABLE"),
              minPrice: z.number(),
              maxPrice: z.number(),
            }),
            z.object({
              type: z.literal("UNAVAILABLE"),
            }),
          ]),
        })
      ),
    },
  },

  latestProducts: {
    method: "GET",
    path: "/latest_products",
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          imgUrl: z.string().nullable(),
          name: z.string(),
          status: zProductStatus,
          rating: z.number(),
          numberOfReviews: z.number(),
          pricing: z.discriminatedUnion("type", [
            z.object({
              type: z.literal("SIMPLE"),
              price: z.number(),
            }),
            z.object({
              type: z.literal("CONFIGURABLE"),
              minPrice: z.number(),
              maxPrice: z.number(),
            }),
            z.object({
              type: z.literal("UNAVAILABLE"),
            }),
          ]),
        })
      ),
    },
  },

  getCartItemsInfo: {
    method: "PUT",
    path: "/products/cart_items_info",
    body: z.object({
      configurable: z.array(z.number().int()),
      simple: z.array(z.number().int()),
    }),
    responses: {
      200: z.object({
        simpleItems: z.array(
          z.object({
            id: z.number().int(),
            name: z.string(),
            pricing: z.number(),
            imgUrl: z.string().nullable(),
            status: zProductStatus,
          })
        ),
        configurableItems: z.array(
          z.object({
            id: z.number().int(),
            name: z.string(),
            pricing: z.number(),
            options: z.array(
              z.object({
                option: z.string(),
                value: z.string(),
              })
            ),
            imgUrl: z.string().nullable(),
            status: zProductStatus,
          })
        ),
      }),
    },
  },

  customerLogin: {
    method: "POST",
    path: "/customers_login",
    body: z.object({
      email: z.string(),
      password: z.string(),
      cart: z.object({
        simpleItems: z.array(
          z.object({
            id: z.number(),
            quantity: z.number(),
          })
        ),
        configurableItems: z.array(
          z.object({
            id: z.number(),
            quantity: z.number(),
          })
        ),
      }),
    }),
    responses: {
      200: z.object({
        token: z.string(),
        isCartUpdated: z.boolean(),
      }),
    },
  },

  productsByTaxonSlug: {
    method: "GET",
    path: "/products_by_taxon",
    query: z.object({
      taxonSlug: z.string(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sortPriceOrder: z.enum(["asc", "desc"]).optional(),
    }),
    responses: {
      200: z.object({
        taxonName: z.string(),
        products: z.array(
          z.object({
            id: z.number(),
            imgUrl: z.string().nullable(),
            name: z.string(),
            status: zProductStatus,
            rating: z.number(),
            numberOfReviews: z.number(),
            pricing: z.discriminatedUnion("type", [
              z.object({
                type: z.literal("SIMPLE"),
                price: z.number(),
              }),
              z.object({
                type: z.literal("CONFIGURABLE"),
                minPrice: z.number(),
                maxPrice: z.number(),
              }),
              z.object({
                type: z.literal("UNAVAILABLE"),
              }),
            ]),
          })
        ),
      }),
    },
  },
});
