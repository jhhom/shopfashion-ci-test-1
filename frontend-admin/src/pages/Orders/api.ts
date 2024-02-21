import { AdminOrdersRequests } from "~/api-contract/admin-api/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { PaginationParameters } from "~/utils/pagination";
import toast from "react-hot-toast";

export const QUERY_KEY = {
  list_orders: "list_orders",
  get_one_order: "get_one_order",
};

export type OrderFilter = {
  dateFrom?: Date;
  dateTo?: Date;
  customerEmail: string | null;
  totalPriceGreaterThan: number | null;
  totalPriceLessThan: number | null;
};
export function useListOrders(
  filter: OrderFilter,
  pagination: PaginationParameters
) {
  return useQuery({
    queryKey: [QUERY_KEY.list_orders, filter, pagination],
    queryFn: async () => {
      const r = await client.orders.listOrders({
        query: {
          filter: {
            ...filter,
            dateFrom: filter.dateFrom?.toISOString() ?? null,
            dateTo: filter.dateTo?.toISOString() ?? null,
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

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const r = await client.orders.cancelOrder({
        params: {
          orderId: orderId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Order is cancelled successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.list_orders] });
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.get_one_order, orderId],
    queryFn: async () => {
      const r = await client.orders.getOneOrder({
        params: { orderId: orderId.toString() },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return {
        ...r.body,
        customer: {
          ...r.body.customer,
          createdAt: new Date(r.body.customer.createdAt),
        },
        order: {
          ...r.body.order,
          createdAt: new Date(r.body.order.createdAt),
        },
      };
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arg: {
      productId: number;
      orderId: number;
      status: AdminOrdersRequests["updateItemShipmentStatus"]["body"];
    }) => {
      const r = await client.orders.updateItemShipmentStatus({
        params: {
          productId: arg.productId.toString(),
          orderId: arg.orderId.toString(),
        },
        body: arg.status,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return { orderId: arg.orderId, result: r.body };
    },
    onSuccess({ orderId }) {
      toast.success("Shipment status is updated successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.get_one_order, orderId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_orders],
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
