import { Link } from "@tanstack/react-router";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { clsx as cx } from "clsx";
import { OrderStatus } from "@api-contract/common";
import { OrderLineItemStatus } from "@api-contract/common";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { IconX } from "~/pages/common/Icons";
import { Table } from "~/pages/common/components/Table/Table";
import {
  OrderPaymentStatus,
  OrderShippingStatus,
} from "~/pages/common/components/Table/OrderStatus";
import { formatPrice } from "~/utils/utils";

type Order = {
  id: number;
  customerEmail: string;
  shippingFee: number;
  totalPrice: number;
  status: OrderStatus;
  shipmentStatus: OrderLineItemStatus;
};

const columnHelper = createColumnHelper<Order>();

const defaultData: Order[] = [
  {
    id: 3,
    customerEmail: "joohom.ong@gmail.com",
    shippingFee: 20,
    totalPrice: 100,
    status: "PAID",
    shipmentStatus: "PROCESSING",
  },
];

export function OrdersTable(props: {
  ordersData: Order[];
  onCancelOrder: (orderId: number) => void;
}) {
  const [orderDialog, setOrderDialog] = useState({
    customerEmail: "",
    orderId: 1,
    open: false,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info) => <div className="flex w-full">{info.getValue()}</div>,
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
      columnHelper.accessor("customerEmail", {
        cell: (info) => <div className="flex w-full">{info.getValue()}</div>,
        header: () => <span>Customer Email</span>,
        meta: {
          headerProps: {
            className: "w-[22%]",
          },
          cellProps: {
            className: "w-[22%]",
          },
        },
      }),
      columnHelper.accessor("shippingFee", {
        cell: (info) => <div className="flex w-full">{info.getValue()}</div>,
        header: () => <span>Shipping Fee</span>,
        meta: {
          headerProps: {
            className: "w-[10%]",
          },
          cellProps: {
            className: "w-[10%]",
          },
        },
      }),
      columnHelper.accessor("totalPrice", {
        cell: (info) => (
          <div className="flex w-full">{formatPrice(info.getValue())}</div>
        ),
        header: () => <span>Total Price</span>,
        meta: {
          headerProps: {
            className: "w-[10%]",
          },
          cellProps: {
            className: "w-[10%]",
          },
        },
      }),
      columnHelper.accessor("status", {
        cell: (info) => <OrderPaymentStatus status={info.getValue()} />,
        header: () => <span className="">Payment Status</span>,
        meta: {
          headerProps: {
            className: "w-[14%]",
          },
          cellProps: {
            className: "w-[14%]",
          },
        },
      }),
      columnHelper.accessor("shipmentStatus", {
        cell: (info) => <OrderShippingStatus status={info.getValue()} />,
        header: () => <span className="">Shipping Status</span>,
        meta: {
          headerProps: {
            className: "w-[14%]",
          },
          cellProps: {
            className: "w-[14%]",
          },
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (i) => (
          <div className="flex space-x-2 py-2">
            <Link
              to="/orders/$orderId"
              params={{ orderId: i.row.original.id.toString() }}
              className="rounded-md bg-gray-200 px-5 py-2.5"
            >
              View
            </Link>
            {i.row.original.status !== "CANCELLED" && (
              <button
                onClick={() =>
                  setOrderDialog({
                    open: true,
                    orderId: i.row.original.id,
                    customerEmail: i.row.original.customerEmail,
                  })
                }
                className="rounded-md bg-red-500 px-5 py-2.5 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        ),
        header: () => <span>Actions</span>,
        meta: {
          headerProps: {
            className: "w-[30%]",
          },
          cellProps: {
            className: "w-[30%]",
          },
        },
      }),
    ],
    [setOrderDialog],
  );

  return (
    <div>
      <Table data={props.ordersData} columns={columns} />
      {orderDialog.open && (
        <CancelOrderDialog
          customerEmail={orderDialog.customerEmail}
          open={orderDialog.open}
          orderId={orderDialog.orderId}
          onClose={() => {
            setOrderDialog((d) => ({
              ...d,
              open: false,
            }));
          }}
          onCancel={() => {
            props.onCancelOrder(orderDialog.orderId);
            setOrderDialog((d) => ({
              ...d,
              open: false,
            }));
          }}
        />
      )}
    </div>
  );
}

function CancelOrderDialog(props: {
  customerEmail: string;
  orderId: number;
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
}) {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Cancel order
                  </Dialog.Title>
                  <button
                    onClick={props.onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                  >
                    <IconX className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="mt-0.5">
                    Are you sure you want to cancel the order
                    <span className="font-semibold">#{props.orderId}</span> by
                    &nbsp;
                    <span className="italic">{props.customerEmail}</span>?
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={props.onCancel}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
