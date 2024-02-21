import {
  zOrderDeliveryAddress,
  zOrderLineItemStatus,
  zProductStatus,
  zTaxon,
} from "../common";

import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const customersApiContract = c.router(
  {
    customerMe: {
      method: "GET",
      path: "/customers/me",
      responses: {
        200: z.object({
          email: z.string(),
        }),
      },
    },

    listPurchases: {
      method: "GET",
      path: "/customers/purchases/:status",
      responses: {
        200: z.object({
          purchases: z.array(
            z.object({
              orderId: z.number(),
              productId: z.number(),
              productName: z.string(),
              productImageUrl: z.string().nullable(),
              quantity: z.number(),
              orderTotal: z.number(),
              unitPrice: z.number(),
              status: zOrderLineItemStatus,
              orderDate: z.string(),
              isConfigurableProduct: z.boolean(),
              canReview: z.boolean(),
            })
          ),
        }),
      },
    },

    getCheckoutInfo: {
      method: "GET",
      path: "/customers/checkout_details",
      responses: {
        200: z.object({
          orderItems: z.array(
            z.object({
              productName: z.string(),
              quantity: z.number(),
              productId: z.string(),
              pricing: z.number(),
              imgUrl: z.string().nullable(),
            })
          ),
          orderSummary: z.object({
            itemsSubtotal: z.number(),
            shippingFee: z.number(),
            subtotal: z.number(),
            orderTotal: z.number(),
          }),
        }),
      },
    },

    requestCheckoutSession: {
      method: "POST",
      path: "/customers/checkout_session",
      body: z.object({
        deliveryAddress: zOrderDeliveryAddress,
      }),
      responses: {
        200: z.object({
          stripeSessionId: z.string(),
        }),
      },
    },

    getShoppingCart: {
      method: "GET",
      path: "/customers/cart",
      responses: {
        200: z.object({
          items: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              quantity: z.number(),
              pricing: z.number(),
              addedAt: z.string(),
              status: zProductStatus,
              imgUrl: z.string().nullable(),
              type: z.discriminatedUnion("type", [
                z.object({ type: z.literal("SIMPLE") }),
                z.object({
                  type: z.literal("CONFIGURABLE"),
                  options: z.array(
                    z.object({ option: z.string(), value: z.string() })
                  ),
                }),
              ]),
            })
          ),
        }),
      },
    },

    removeCartItem: {
      method: "DELETE",
      path: "/customers/:productId/cart_items/:productType",
      body: null,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },

    setCartItemQuantity: {
      method: "PUT",
      path: "/customers/:productId/cart_item",
      body: z.object({
        quantity: z.number(),
        type: z.enum(["SIMPLE", "CONFIGURABLE"]),
      }),
      responses: {
        200: z.object({ message: z.string() }),
      },
    },

    createProductReview: {
      method: "POST",
      path: "/customers/product_reviews/:productId",
      body: z.object({
        isConfigurableProduct: z.boolean(),
        comment: z.string(),
        rating: z.number().int().gte(0).lte(5),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
      },
    },

    customerVerifyToken: {
      method: "POST",
      path: "/customers/verify_token",
      body: null,
      responses: {
        200: z.object({
          email: z.string(),
        }),
      },
    },

    customerAddToCart: {
      method: "POST",
      path: "/customers/add_to_cart",
      body: z.object({
        productId: z.number().int(),
        type: z.enum(["SIMPLE", "CONFIGURABLE"]),
        quantity: z.number().int(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  {
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  }
);
