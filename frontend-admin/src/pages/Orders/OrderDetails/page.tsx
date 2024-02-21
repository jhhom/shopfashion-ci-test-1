import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import {
  IconPencil,
  IconShirt,
  IconShoppingCart,
  IconX,
} from "~/pages/common/Icons";
import { PageTitle } from "~/pages/common/components/PageTitle";

import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import * as Tooltip from "@radix-ui/react-tooltip";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { OrderShippingStatus } from "~/pages/common/components/Table/OrderStatus";
import { formatPrice } from "~/utils/utils";
import { useOrder, useUpdateShipmentStatus } from "~/pages/Orders/api";
import { OrderLineItemStatus } from "~/api-contract/common";

export function OrderDetailsPage() {
  const orderId = Number.parseInt(
    useParams({ from: "/orders/$orderId" }).orderId
  );

  const [openEditDialog, setOpenEditDialog] = useState<{
    open: boolean;
    productId: number;
    productName: string;
    isConfigurableProduct: boolean;
    status: OrderLineItemStatus;
  }>({
    open: false,
    productId: 0,
    productName: "",
    isConfigurableProduct: true,
    status: "COMPLETED",
  });

  const getOrderQuery = useOrder(orderId);

  const updateShipmentStatusMutation = useUpdateShipmentStatus();

  if (getOrderQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display order"
        failed="load order's data"
      />
    );
  }

  if (!getOrderQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle
        title={`Order #${orderId}`}
        description={
          getOrderQuery?.data?.order.createdAt
            ? format(
                getOrderQuery.data.order.createdAt,
                "MMM dd, yyyy, h:mm:ss a"
              )
            : ""
        }
        icon={<IconShoppingCart className="h-6 w-6 text-teal-500" />}
      />
      <div className="mt-4 flex">
        <div className="mr-10 basis-3/4 overflow-x-auto rounded-md border border-gray-300 bg-white p-4 text-sm">
          <table className="w-full min-w-[760px] table-fixed divide-y divide-gray-300 rounded-md border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="w-full border-r border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="w-[170px] border-r border-gray-300 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Shipment
                </th>
                <th
                  scope="col"
                  className="w-[100px] border-r border-gray-300 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="w-[100px] border-r border-gray-300 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Unit price
                </th>
                <th
                  scope="col"
                  className="w-[100px] border-r border-gray-300 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Quantity
                </th>

                <th
                  scope="col"
                  className="w-[100px] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {(getOrderQuery.data?.orderLineItems ?? []).map((i) => (
                <tr key={i.productId}>
                  <td className="border-r border-gray-300 py-4 pl-4">
                    <div className="flex">
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                        {i.productImageUrl === null ? (
                          <div className="flex items-center justify-center px-2 py-2 text-center">
                            No image
                          </div>
                        ) : (
                          <img
                            src={i.productImageUrl}
                            className="h-full w-full rounded-md object-cover"
                          />
                        )}
                      </div>
                      <p className="pl-2">{i.productName}</p>
                    </div>
                  </td>
                  <td className="border-r border-gray-300 pl-3 pr-1.5">
                    <OrderShippingStatus status={i.orderLineItemStatus} />
                  </td>
                  <td className="border-r border-gray-300 pl-3">
                    <button
                      onClick={() =>
                        setOpenEditDialog({
                          open: true,
                          productName: i.productName,
                          productId: i.productId,
                          isConfigurableProduct: i.isConfigurableProduct,
                          status: i.orderLineItemStatus,
                        })
                      }
                      className="flex items-center rounded-md bg-gray-200 px-3 py-2 text-center"
                    >
                      <span className="flex h-5 w-5 items-center">
                        <IconPencil className="h-3.5 w-3.5 text-gray-500" />
                      </span>
                      <span className="pl-0.5">Edit</span>
                    </button>
                  </td>
                  <td className="border-r border-gray-300 pl-3">
                    RM {formatPrice(i.unitPrice)}
                  </td>
                  <td className="border-r border-gray-300 pl-3">
                    {i.quantity}
                  </td>
                  <td className="pl-3">
                    RM {formatPrice(i.quantity * i.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-gray-300">
                <td
                  colSpan={5}
                  className="border-r border-gray-300 bg-gray-50"
                ></td>
                <td className="bg-gray-50 py-2.5 pr-2 text-right">
                  <span className="font-semibold">Items total:</span>
                  <span className="mt-1 block">
                    RM{" "}
                    {formatPrice(getOrderQuery.data?.order.itemsSubtotal ?? 0)}
                  </span>
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="py-3.5 pr-2 text-right">
                  <span className="font-semibold">Shipping total: &nbsp;</span>
                  <span className="">
                    RM{" "}
                    {formatPrice(getOrderQuery.data?.order.shippingTotal ?? 0)}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={6}
                  className="border-t border-gray-300 py-3.5 pr-2 text-right text-xl font-semibold"
                >
                  Order total: RM{" "}
                  {formatPrice(getOrderQuery.data?.order.orderTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="basis-1/4 overflow-x-auto  text-sm">
          <div className="rounded-md border border-gray-300 bg-white p-4 shadow-o-md">
            <p className="text-lg font-medium">
              {getOrderQuery.data?.customer.email}
            </p>
            <p className="mt-1 text-gray-400">
              Customer since{" "}
              {getOrderQuery.data?.customer
                ? format(getOrderQuery.data?.customer.createdAt, "MMM dd, yyyy")
                : ""}
            </p>
          </div>
          <div className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-o-md">
            <p className="text-lg font-medium">Delivery address</p>
            <div className="mt-1 text-gray-400">
              <p>{getOrderQuery.data.order.deliveryAddress.fullName}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.address1}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.address2}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.city}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.state}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.postalCode}</p>
              <p>{getOrderQuery.data.order.deliveryAddress.mobilePhone}</p>
            </div>
          </div>
        </div>
      </div>
      <EditShipmentStatusDialog2
        open={openEditDialog.open}
        onClose={() =>
          setOpenEditDialog({
            open: false,
            productId: 0,
            productName: "",
            isConfigurableProduct: true,
            status: "COMPLETED",
          })
        }
        productName={openEditDialog.productName}
        status={openEditDialog.status}
        onSetStatus={(status) => {
          setOpenEditDialog((v) => ({
            ...v,
            status,
          }));
        }}
        onSubmit={() => {
          updateShipmentStatusMutation.mutate({
            productId: openEditDialog.productId,
            orderId,
            status: {
              status: openEditDialog.status,
              isConfigurableProduct: openEditDialog.isConfigurableProduct,
            },
          });
          setOpenEditDialog({
            open: false,
            productId: 0,
            productName: "",
            isConfigurableProduct: true,
            status: "COMPLETED",
          });
        }}
      />
    </div>
  );
}

function EditShipmentStatusDialog2(props: {
  open: boolean;
  onClose: () => void;
  productName: string;
  status: OrderLineItemStatus;
  onSetStatus: (status: OrderLineItemStatus) => void;
  onSubmit: () => void;
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
                    Edit shipment status
                  </Dialog.Title>
                  <button
                    onClick={props.onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                  >
                    <IconX className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">Order</p>
                  <p className="mt-0.5">{props.productName}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">Shipment Status</p>
                  <div className="mt-1.5 space-y-1 text-sm">
                    <ShipmentStatusRadioButton
                      checked={props.status === "PROCESSING"}
                      onChange={(checked) =>
                        checked ? props.onSetStatus("PROCESSING") : undefined
                      }
                      tooltipText="The order has been confirmed and is in processing."
                      label="Processing"
                      id="radio-processing"
                    />
                    <ShipmentStatusRadioButton
                      checked={props.status === "TO_SHIP"}
                      onChange={(checked) =>
                        checked ? props.onSetStatus("TO_SHIP") : undefined
                      }
                      tooltipText="The ordered item is ready to be shipped."
                      label="To ship"
                      id="radio-to-ship"
                    />
                    <ShipmentStatusRadioButton
                      checked={props.status === "TO_RECEIVE"}
                      onChange={(checked) =>
                        checked ? props.onSetStatus("TO_RECEIVE") : undefined
                      }
                      tooltipText="The ordered item is in shipping and customer can expect to receive it soon."
                      label="To receive"
                      id="radio-to-receive"
                    />

                    <ShipmentStatusRadioButton
                      checked={props.status === "COMPLETED"}
                      onChange={(checked) =>
                        checked ? props.onSetStatus("COMPLETED") : undefined
                      }
                      tooltipText="Customer has received their order."
                      label="Completed"
                      id="radio-completed"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => props.onSubmit()}
                  >
                    Submit
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

function ShipmentStatusRadioButton(props: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltipText: string;
  label: string;
}) {
  return (
    <div>
      <Tooltip.Provider delayDuration={400}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex w-fit">
              <input
                type="radio"
                id={props.id}
                checked={props.checked}
                onChange={(e) => {
                  props.onChange(e.target.checked);
                }}
              />
              <label
                className="ml-1 rounded-md px-1 hover:bg-gray-100"
                htmlFor={props.id}
              >
                {props.label}
              </label>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[20] max-w-[240px] rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm"
              sideOffset={5}
            >
              <p>{props.tooltipText}</p>

              <Tooltip.Arrow
                style={{
                  fill: "rgb(243 244 246 / var(--tw-bg-opacity))",
                }}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
