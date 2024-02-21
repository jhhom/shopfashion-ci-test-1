// contract.ts

import { initContract } from "@ts-rest/core";
import {
  zOrderStatus,
  zOrderLineItemStatus,
  zOrderDeliveryAddress,
} from "../common";
import { zPagination, zPaginationMeta } from "./common";
import { z } from "zod";

const c = initContract();

export const orderApiContract = c.router({
  listOrders: {
    method: "GET",
    path: "/orders",
    query: z.object({
      filter: z
        .object({
          dateFrom: z.string().nullable(),
          dateTo: z.string().nullable(),
          customerEmail: z.string().nullable(),
          totalPriceGreaterThan: z.number().nullable(),
          totalPriceLessThan: z.number().nullable(),
        })
        .nullable(),
      pagination: zPagination.nullable(),
    }),
    responses: {
      200: z.object({
        results: z.array(
          z.object({
            id: z.number(),
            customerEmail: z.string(),
            shippingFee: z.number(),
            totalPrice: z.number(),
            status: zOrderStatus,
            shipmentStatus: zOrderLineItemStatus,
          })
        ),
        paginationMeta: zPaginationMeta,
      }),
    },
  },

  getOneOrder: {
    method: "GET",
    path: "/orders/:orderId",
    responses: {
      200: z.object({
        order: z.object({
          itemsSubtotal: z.number(),
          shippingTotal: z.number(),
          orderTotal: z.number(),
          orderStatus: zOrderStatus,
          createdAt: z.string(),
          deliveryAddress: zOrderDeliveryAddress,
        }),
        customer: z.object({
          email: z.string(),
          createdAt: z.string(),
        }),
        orderLineItems: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            unitPrice: z.number(),
            quantity: z.number().int(),
            orderLineItemStatus: zOrderLineItemStatus,
            isConfigurableProduct: z.boolean(),
            productImageUrl: z.string().nullable(),
          })
        ),
      }),
    },
  },

  cancelOrder: {
    method: "PUT",
    path: "/orders/:orderId/cancel",
    body: null,
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  updateItemShipmentStatus: {
    method: "PUT",
    path: "/orders/:orderId/product/:productId/shipment_status",
    body: z.object({
      isConfigurableProduct: z.boolean(),
      status: zOrderLineItemStatus,
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },
});
