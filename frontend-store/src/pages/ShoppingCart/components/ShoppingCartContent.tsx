import { ProductStatus } from "@api-contract/common";
import { Link } from "@tanstack/react-router";
import { MissingProductImage } from "~/pages/common/ErrorContents";
import { IconClose } from "~/pages/common/Icons";
import { Breadcrumb, breadcrumb } from "~/pages/common/components/Breadcrumb";
import { QuantityInputSmall } from "~/pages/common/components/QuantityInput";

import { clsx as cx } from "clsx";
import { formatPrice } from "~/utils/utils";

export type CartItem =
  | SimpleCartItemProps["item"]
  | ConfigurableCartItemProps["item"];

export function ShoppingCartContent(props: {
  itemsToDisplay: CartItem[];
  onRemoveCartItem: (id: number, type: "SIMPLE" | "CONFIGURABLE") => void;
  onSetItemQuantity: ({
    id,
    type,
    quantity,
  }: {
    id: number;
    type: "SIMPLE" | "CONFIGURABLE";
    quantity: number;
  }) => void;
  onCheckout: () => void;
}) {
  return props.itemsToDisplay.length > 0 ? (
    <CartWithItems
      items={props.itemsToDisplay}
      onRemoveCartItem={props.onRemoveCartItem}
      onSetItemQuantity={props.onSetItemQuantity}
      onCheckout={props.onCheckout}
    />
  ) : (
    <CartWithoutItems />
  );
}

function CartWithoutItems() {
  return (
    <div className="mt-12 px-4 pb-12 text-sm md:px-12">
      <p>Your cart is currently empty.</p>

      <Link
        to="/"
        className="mt-6 block w-[300px] rounded-md bg-black py-2.5 text-center font-bold uppercase text-white"
      >
        Continue shopping
      </Link>
    </div>
  );
}

function CartWithItems(props: {
  items: CartItem[];
  onRemoveCartItem: (id: number, type: "SIMPLE" | "CONFIGURABLE") => void;
  onSetItemQuantity: ({
    id,
    type,
    quantity,
  }: {
    id: number;
    type: "SIMPLE" | "CONFIGURABLE";
    quantity: number;
  }) => void;
  onCheckout: () => void;
}) {
  const purchasedItems = props.items.filter((i) => i.status === "ACTIVE");

  const totalPrice = purchasedItems
    .map((i) => i.quantity * i.pricing)
    .reduce((acc, currVal) => acc + currVal, 0);

  return (
    <div className="px-4 pb-12 pt-12 lg:px-12">
      <div className="flex flex-col lg:flex-row">
        <div className="order-2 mt-12 flex-grow basis-[580px] rounded-md border border-gray-300 px-4 pt-6 text-sm lg:order-1 lg:mt-0 lg:pb-4 lg:pt-4">
          <div className="flex ">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-center font-bold text-white">
              {props.items.length}
            </div>
          </div>
          <div>
            {props.items.map((i) => {
              return i.type.type === "SIMPLE" ? (
                <SimpleCartItem
                  key={"s-" + i.id}
                  item={{
                    id: i.id,
                    name: i.name,
                    pricing: i.pricing,
                    addedAt: i.addedAt,
                    quantity: i.quantity,
                    imgUrl: i.imgUrl,
                    type: i.type,
                    status: i.status,
                  }}
                  onRemoveItem={() => props.onRemoveCartItem(i.id, "SIMPLE")}
                  onSetItemQuantity={(quantity) => {
                    if (quantity <= 0) {
                      quantity = 0;
                    }
                    props.onSetItemQuantity({
                      id: i.id,
                      quantity,
                      type: "SIMPLE",
                    });
                  }}
                />
              ) : (
                <ConfigurableCartItem
                  key={"c-" + i.id}
                  item={{
                    id: i.id,
                    name: i.name,
                    pricing: i.pricing,
                    addedAt: i.addedAt,
                    quantity: i.quantity,
                    imgUrl: i.imgUrl,
                    type: i.type,
                    status: i.status,
                  }}
                  onRemoveItem={() => {
                    props.onRemoveCartItem(i.id, "CONFIGURABLE");
                  }}
                  onSetItemQuantity={(quantity) => {
                    if (quantity <= 0) {
                      quantity = 0;
                    }
                    props.onSetItemQuantity({
                      id: i.id,
                      quantity,
                      type: "CONFIGURABLE",
                    });
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="order-1 md:basis-[calc(100%-580px)] lg:order-2 lg:max-w-[520px] lg:basis-[calc(100%-700px)] lg:pl-4">
          <div className="rounded-md border border-gray-300 px-4 py-4 ">
            <p className="font-semibold">
              Order Summary | {purchasedItems.length} Item (s)
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <p>Item(s) subtotal</p>
                <p>RM {formatPrice(totalPrice)}</p>
              </div>
              <div className="mt-6 flex justify-between font-semibold">
                <p>Subtotal</p>
                <p>RM {formatPrice(totalPrice)}</p>
              </div>
              <div className="mt-1.5 flex justify-between font-semibold">
                <p>Order total</p>
                <p>RM {formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={props.onCheckout}
              disabled={purchasedItems.length === 0}
              className={cx(
                "block w-full rounded-md bg-teal-500 py-2.5",
                "text-center font-bold text-white",
                {
                  "cursor-not-allowed bg-teal-500/50":
                    purchasedItems.length === 0,
                },
              )}
            >
              Checkout
            </button>
            <Link
              to="/"
              className="mt-4 block w-full rounded-md border border-gray-400 py-2.5 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type SimpleCartItemProps = {
  item: {
    id: number;
    name: string;
    quantity: number;
    pricing: number;
    addedAt: Date | undefined;
    status: ProductStatus;
    imgUrl: string | null;
    type: {
      type: "SIMPLE";
    };
  };
  onRemoveItem: () => void;
  onSetItemQuantity: (quantity: number) => void;
};

function SimpleCartItem(props: SimpleCartItemProps) {
  return (
    <div className="flex border-b border-gray-300 pb-8 pt-8 last:border-b-0">
      <div className="h-32 w-32">
        {props.item.imgUrl ? (
          <img
            className="h-full w-full rounded-md object-cover"
            src={props.item.imgUrl}
          />
        ) : (
          <MissingProductImage />
        )}
      </div>
      <div className="flex flex-grow justify-between pl-4">
        <div>
          <p className="text-lg font-semibold">{props.item.name}</p>
          <p className="text-sm text-gray-500">Product ID: S-{props.item.id}</p>
          <div className="mt-4 flex">
            <p className="mr-1">Unit Price:</p>
            <p className="text-right font-semibold">RM {props.item.pricing}</p>
          </div>
          <div className="mt-4">
            <p>Quantity</p>
            <div className="mt-2">
              <QuantityInputSmall
                quantity={props.item.quantity}
                setQuantity={props.onSetItemQuantity}
                disabled={props.item.status === "OUT_OF_STOCK"}
              />
              {props.item.status === "OUT_OF_STOCK" && (
                <div className="mt-1.5 text-sm text-red-500">Out of stock</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-end">
              <button
                onClick={props.onRemoveItem}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-right">
              <p className="mt-2">Subtotal</p>
              <p
                className={cx("text-lg font-medium decoration-1", {
                  "line-through": props.item.status === "OUT_OF_STOCK",
                })}
              >
                RM {formatPrice(props.item.quantity * props.item.pricing)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ConfigurableCartItemProps = {
  item: {
    id: number;
    name: string;
    quantity: number;
    pricing: number;
    addedAt: Date | undefined;
    imgUrl: string | null;
    status: ProductStatus;
    type: {
      type: "CONFIGURABLE";
      options: { option: string; value: string }[];
    };
  };
  onRemoveItem: () => void;
  onSetItemQuantity: (quantity: number) => void;
};

function ConfigurableCartItem(props: ConfigurableCartItemProps) {
  return (
    <div className="flex border-b border-gray-300 pb-8 pt-8 last:border-b-0">
      <div className="h-32 w-32">
        {props.item.imgUrl ? (
          <img
            className="h-full w-full rounded-md object-cover"
            src={props.item.imgUrl}
          />
        ) : (
          <MissingProductImage />
        )}
      </div>
      <div className="flex flex-grow justify-between pl-4">
        <div>
          <p className="text-lg font-semibold">{props.item.name}</p>
          <p className="text-sm text-gray-500">
            Product ID: {`C-${props.item.id}`}
          </p>
          <div className="mt-2">
            <div className="text-gray-500">
              {props.item.type.options.map((v) => (
                <p key={`${v.option}-${v.value}`}>
                  {v.option}: <span className="text-black">{v.value}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="mt-4 flex">
            <p className="mr-1">Unit Price:</p>
            <p className="text-right font-semibold">
              RM {formatPrice(props.item.pricing)}
            </p>
          </div>
          <div className="mt-4">
            <p>Quantity</p>
            <div className="mt-2">
              <QuantityInputSmall
                quantity={props.item.quantity}
                setQuantity={props.onSetItemQuantity}
                disabled={props.item.status === "OUT_OF_STOCK"}
              />
            </div>
            {props.item.status === "OUT_OF_STOCK" && (
              <div className="mt-1.5 text-sm text-red-500">Out of stock</div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-end">
              <button
                onClick={props.onRemoveItem}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-right">
              <p className="mt-2">Subtotal</p>
              <p
                className={cx("text-lg font-medium decoration-1", {
                  "line-through": props.item.status === "OUT_OF_STOCK",
                })}
              >
                RM {formatPrice(props.item.quantity * props.item.pricing)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
