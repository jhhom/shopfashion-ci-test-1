import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";
import { useAppStore } from "~/stores/stores";

import { QUERY_KEY } from "~/pages/Membership/query";
import { client } from "~/external/api-client/client";
import {
  Link,
  MakeLinkOptions,
  Outlet,
  useSearch,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { clsx as cx } from "clsx";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IconShirt } from "~/pages/common/Icons";

import { Rating } from "~/pages/common/Rating";

import { parseApiError } from "~/utils/api-error";

import { match } from "ts-pattern";
import toast from "react-hot-toast";
import { formatPrice } from "~/utils/utils";
import {
  useCreateProductReview,
  usePurchases,
} from "~/pages/Membership/api";

export function PurchaseHistorySubpage() {
  const [openReviewProductDialog, setOpenReviewProductDialog] = useState({
    open: false,
    productName: "",
    productId: 0,
    productImageUrl: "",
    isConfigurableProduct: false,
  });

  const searchParams = useSearch({ from: "/e-commerce/member/purchases" });

  const purchasesQuery = usePurchases(searchParams.status);
  const createProductReviewMutation = useCreateProductReview();

  return (
    <div className="pb-12">
      <Tabs status={searchParams.status} />
      <div className="rounded-b-md border border-t-0 border-gray-300 px-5 py-5 text-sm">
        {(purchasesQuery.data?.purchases ?? []).map((p) => (
          <ProductHistoryItem
            key={`${p.orderId}-${p.productId}`}
            onRate={() =>
              setOpenReviewProductDialog({
                open: true,
                productName: p.productName,
                productImageUrl: p.productImageUrl ?? "",
                productId: p.productId,
                isConfigurableProduct: p.isConfigurableProduct,
              })
            }
            {...p}
            orderDate={new Date(p.orderDate)}
          />
        ))}
      </div>
      <ReviewProductDialog
        productName={openReviewProductDialog.productName}
        productImageUrl={openReviewProductDialog.productImageUrl}
        open={openReviewProductDialog.open}
        onSubmit={(rating, comment) => {
          createProductReviewMutation.mutate({
            productId: openReviewProductDialog.productId,
            review: {
              isConfigurableProduct:
                openReviewProductDialog.isConfigurableProduct,
              comment,
              rating,
            },
          });
          setOpenReviewProductDialog((p) => ({
            ...p,
            open: false,
          }));
        }}
        onClose={() =>
          setOpenReviewProductDialog((p) => ({
            ...p,
            open: false,
          }))
        }
      />
    </div>
  );
}

function ProductHistoryItem(props: {
  onRate: () => void;
  productName: string;
  productId: number;
  isConfigurableProduct: boolean;
  productImageUrl: string | null;
  status: "TO_RECEIVE" | "COMPLETED" | "PROCESSING" | "TO_SHIP";
  orderId: number;
  orderTotal: number;
  unitPrice: number;
  quantity: number;
  orderDate: Date;
  canReview: boolean;
}) {
  return (
    <div className="border-b border-gray-300 px-1 pb-4 pt-4 last:border-b-0">
      <div className="flex justify-between">
        <div>
          <p>{props.productName}</p>
          <div className="flex">
            <div className="mt-2 h-16 w-16 rounded-md border">
              {props.productImageUrl === null ? (
                <div className="flex h-full w-full items-center justify-center text-center text-xs">
                  No image
                </div>
              ) : (
                <img
                  className="h-16 w-16 rounded-md object-cover"
                  src={props.productImageUrl}
                />
              )}
            </div>
            <p className="ml-3 mt-auto">x {props.quantity}</p>
          </div>
        </div>
        <p>RM {formatPrice(props.unitPrice)}</p>
      </div>

      <div className="flex justify-end">
        <p>Order total: RM {formatPrice(props.unitPrice * props.quantity)}</p>
      </div>

      <div className="mt-4">
        Purchased at: {format(props.orderDate, "MMM dd, yyyy, h:mm:ss a")}
      </div>
      {props.canReview && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={props.onRate}
            className="rounded-md bg-teal-500 px-6 py-1.5 text-white"
          >
            Rate
          </button>
        </div>
      )}
    </div>
  );
}

function Tabs({
  status,
  className,
}: {
  status: "TO_RECEIVE" | "COMPLETED" | "CANCELLED";
  className?: string;
}) {
  return (
    <nav
      className={cx(
        "isolate flex divide-x divide-gray-200 rounded-t-lg border border-gray-300",
        className,
      )}
      aria-label="Tabs"
    >
      <TabButton
        search={{ status: "TO_RECEIVE" }}
        isActive={status === "TO_RECEIVE"}
      >
        to receive
      </TabButton>
      <TabButton
        search={{ status: "COMPLETED" }}
        isActive={status === "COMPLETED"}
      >
        completed
      </TabButton>
      <TabButton
        search={{ status: "CANCELLED" }}
        isActive={status === "CANCELLED"}
      >
        cancelled
      </TabButton>
    </nav>
  );
}

function TabButton({
  children,
  className,
  isActive,
  ...props
}: MakeLinkOptions & {
  isActive: boolean;
}) {
  return (
    <Link
      {...props}
      className={cx(
        "group relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-medium capitalize first:rounded-tl-lg last:rounded-tr-lg focus:z-10",
        className,
      )}
      inactiveProps={{
        className: "bg-white hover:bg-gray-50 ",
      }}
      activeProps={{
        className: "bg-teal-100 text-teal-700 font-semibold",
      }}
      aria-current={isActive}
    >
      {children}
    </Link>
  );
}

function ReviewProductDialog(props: {
  productName: string;
  productImageUrl: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Rate Product
                  </Dialog.Title>
                </div>

                <div className="mt-6 flex">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100">
                    {props.productImageUrl === "" ? (
                      <IconShirt className="h-8 w-8 text-gray-500" />
                    ) : (
                      <img
                        src={props.productImageUrl}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    )}
                  </div>

                  <div className="ml-3">{props.productName}</div>
                </div>

                <div className="mt-4 flex items-center text-sm">
                  <p>Product Quality</p>
                  <Rating
                    className="ml-12 h-8 max-w-[180px]"
                    value={rating}
                    onChange={setRating}
                  />
                  <p
                    className={cx("ml-3", {
                      "text-gray-500": rating < 4,
                      "font-medium text-yellow-500": rating > 3,
                    })}
                  >
                    {match(rating)
                      .with(1, () => "Terrible")
                      .with(2, () => "Poor")
                      .with(3, () => "Fair")
                      .with(4, () => "Good")
                      .with(5, () => "Amazing")
                      .otherwise(() => "Terrible")}
                  </p>
                </div>

                <div className="mt-6 text-sm">
                  <p>Additional Comments</p>
                  <textarea
                    className="mt-2 w-full resize-none rounded-md border border-gray-300 py-2 pl-3 shadow-o-sm"
                    placeholder="Share some thoughts on the product to help other buyers."
                    rows={10}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium uppercase hover:bg-gray-100  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={props.onClose}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-teal-500 px-10 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => props.onSubmit(rating, comment)}
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
