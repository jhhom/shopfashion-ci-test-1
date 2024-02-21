import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { zPagination, zPaginationMeta } from "./common";
import { zOrderLineItemStatus, zOrderStatus } from "../common";

const c = initContract();

export const customersApiContract = c.router({
  customers: {
    method: "GET",
    path: "/customers",
    query: z.object({
      filter: z.object({
        email: z.string().nullable(),
      }),
      pagination: zPagination.nullable(),
    }),
    responses: {
      200: z.object({
        results: z.array(
          z.object({
            id: z.number(),
            email: z.string(),
            registeredAt: z.string(),
          })
        ),
        paginationMeta: zPaginationMeta,
      }),
    },
  },

  customerDetails: {
    method: "GET",
    path: "/customers/:customerId",
    responses: {
      200: z.object({
        numberOfOrders: z.number(),
        totalOrdersValue: z.number(),
        avgOrdersValue: z.number(),
        customerEmail: z.string(),
        customerSince: z.string(),
        orders: z.array(
          z.object({
            date: z.string(),
            orderId: z.number(),
            paymentStatus: zOrderStatus,
            shipmentStatus: zOrderLineItemStatus,
            totalPrice: z.number(),
          })
        ),
      }),
    },
  },
});
