import { OrderStatus } from "@api-contract/common";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "~/pages/common/components/Table/Table";
import { format } from "date-fns";
import { IconMagnifyingGlass } from "~/pages/common/Icons";
import { Link } from "@tanstack/react-router";
import { OrderLineItemStatus } from "@api-contract/common";
import { NoResultIndicator } from "~/pages/common/components/Table/NoResultIndicator";
import {
  OrderPaymentStatus,
  OrderShippingStatus,
} from "~/pages/common/components/Table/OrderStatus";
import { formatPrice } from "~/utils/utils";

export type Order = {
  date: Date;
  orderId: number;
  paymentStatus: OrderStatus;
  shipmentStatus: OrderLineItemStatus;
  totalPrice: number;
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor("date", {
    id: "Date",
    cell: (info) => format(info.getValue(), "dd-MM-yyyy HH:mm"),
    header: () => <span>Date</span>,
    meta: {
      headerProps: {
        className: "w-[24%]",
      },
      cellProps: {
        className: "w-[24%]",
      },
    },
  }),
  columnHelper.accessor("orderId", {
    id: "Order ID",
    cell: (info) => info.getValue(),
    header: () => <span>Order ID</span>,
    meta: {
      headerProps: {
        className: "w-[10%]",
      },
      cellProps: {
        className: "w-[10%]",
      },
    },
  }),
  columnHelper.accessor("paymentStatus", {
    id: "Status",
    cell: (info) => <OrderPaymentStatus status={info.getValue()} />,
    header: () => <span>Status</span>,
    meta: {
      headerProps: {
        className: "w-[17%]",
      },
      cellProps: {
        className: "w-[17%]",
      },
    },
  }),
  columnHelper.accessor("shipmentStatus", {
    id: "Shipment Status",
    cell: (info) => <OrderShippingStatus status={info.getValue()} />,
    header: () => <span>Shipment Status</span>,
    meta: {
      headerProps: {
        className: "w-[17%]",
      },
      cellProps: {
        className: "w-[17%]",
      },
    },
  }),
  columnHelper.accessor("totalPrice", {
    id: "totalPrice",
    cell: (info) => formatPrice(info.getValue()),
    header: () => <span>Total Price</span>,
    meta: {
      headerProps: {
        className: "w-[13%]",
      },
      cellProps: {
        className: "w-[13%]",
      },
    },
  }),

  columnHelper.display({
    id: "actions",
    cell: (i) => (
      <Link
        to="/orders/$orderId"
        params={{ orderId: i.row.original.orderId.toString() }}
        className="flex h-9 w-fit items-center rounded-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300"
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconMagnifyingGlass className="h-3.5 w-3.5" />
        </span>
        Show
      </Link>
    ),
    header: () => <span>Actions</span>,
    meta: {
      headerProps: {
        className: "w-[18%]",
      },
      cellProps: {
        className: "w-[18%]",
      },
    },
  }),
];

export function CustomerOrdersTable({ orders }: { orders: Order[] }) {
  return orders.length > 0 ? (
    <Table className="py-2" data={orders} columns={columns} />
  ) : (
    <NoResultIndicator />
  );
}
