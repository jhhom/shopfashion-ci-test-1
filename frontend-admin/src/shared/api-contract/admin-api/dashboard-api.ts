import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const zGraphPeriod = z.enum(["TWO_WEEKS", "MONTH", "YEAR"]);

export const dashboardApiContract = c.router({
  salesGraph: {
    method: "GET",
    path: "/dashboard/sales_graph/:period",
    query: z.object({ date: z.string() }),
    responses: {
      200: z.object({
        totalSales: z.number(),
        numOfPaidOrders: z.number(),
        numOfCustomers: z.number(),
        avgOrderValue: z.number(),
        salesAmount: z.array(
          z.object({
            date: z.string(),
            amount: z.number(),
          })
        ),
        meta: z.object({
          start: z.string(),
          end: z.string(),
        }),
      }),
    },
  },

  recentCustomersOrders: {
    method: "GET",
    path: "/dashboard/recent_customers_orders",
    responses: {
      200: z.object({
        customers: z.array(
          z.object({
            email: z.string(),
            id: z.number(),
          })
        ),
        orders: z.array(
          z.object({
            id: z.number(),
            email: z.string(),
            numOfItems: z.number(),
            totalPrice: z.number(),
          })
        ),
      }),
    },
  },
});
