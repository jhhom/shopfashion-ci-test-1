import { clsx as cx } from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import { DeliveryFormSchema } from "~/pages/Checkout/components/delivery-form";
import { formatPrice } from "~/utils/utils";

export type OrderSummary = {
  itemsSubtotal: number;
  shippingFee: number;
  subtotal: number;
  orderTotal: number;
};

export function FormView2(props: {
  onPayment: () => void;
  deliveryAddress: DeliveryFormSchema;
  orderSummary: OrderSummary;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    // reference: https://stackoverflow.com/questions/49820013/javascript-scrollintoview-smooth-scroll-and-offset
    divRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <DeliverOptionSavedView deliveryAddress={props.deliveryAddress} />
      <div
        ref={divRef}
        className="mt-10 scroll-mt-24 rounded-md border border-gray-300 pb-4"
      >
        <OrderSummary
          onPayment={props.onPayment}
          orderSummary={props.orderSummary}
        />
      </div>
    </div>
  );
}

function DeliverOptionSavedView(props: {
  deliveryAddress: DeliveryFormSchema;
}) {
  return (
    <div className="rounded-md border border-gray-300">
      <div className="border-b border-gray-300 px-5 py-3 font-semibold">
        <p>1. Delivery Information</p>
      </div>
      <div className="px-5 py-4">
        <p className="font-semibold">SHIP TO ADDRESS</p>
        <div className="mt-4 space-y-0.5 text-sm">
          <p>{props.deliveryAddress.fullName}</p>
          <p>{props.deliveryAddress.address1}</p>
          <p>{props.deliveryAddress.address2}</p>
          <p>
            {props.deliveryAddress.postalCode} {props.deliveryAddress.city},{" "}
            {props.deliveryAddress.state}
          </p>
          <p>{props.deliveryAddress.mobilePhone}</p>
        </div>
      </div>
    </div>
  );
}

function OrderSummary(props: {
  orderSummary: OrderSummary;
  onPayment: () => void;
}) {
  return (
    <div className="rounded-md">
      <div
        id="order-summary"
        className="border-b border-gray-300 px-5 py-3 font-semibold"
      >
        <p>2. Order Summary</p>
      </div>
      <div className="px-3 py-4">
        <div className="flex justify-between text-sm">
          <p>Item(s) subtotal</p>
          <p>RM {formatPrice(props.orderSummary.itemsSubtotal)}</p>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <p>Shipping</p>
          <p>RM {formatPrice(props.orderSummary.shippingFee)}</p>
        </div>
        <hr className="my-3.5 border-gray-300" />
        <div className="mt-2 flex justify-between text-sm">
          <p className="font-semibold">SUBTOTAL</p>
          <p>RM {formatPrice(props.orderSummary.itemsSubtotal)}</p>
        </div>
        <hr className="my-3.5 border-gray-300" />
        <div className="mt-2 flex justify-between text-sm">
          <p className="font-semibold">ORDER TOTAL</p>
          <p>RM {formatPrice(props.orderSummary.orderTotal)}</p>
        </div>
      </div>
      <div className="mt-4 px-3">
        <button
          onClick={props.onPayment}
          className="w-full bg-teal-500 py-2.5 text-sm font-semibold uppercase text-white md:w-[240px]"
        >
          Continue To Payment
        </button>
        <DemoNote marginTop="mt-8" />
      </div>
    </div>
  );
}

function DemoNote(props: { marginTop?: string }) {
  return (
    <div
      className={cx(
        "animate-tada rounded-md border border-yellow-400 bg-yellow-100 px-4 py-2.5 text-sm",
        props.marginTop
      )}
    >
      <div className="flex items-center">
        <div className="h-6 w-6">
          <IconInfo className="text-yellow-600" />
        </div>
        <span className="ml-1.5 text-lg">Note for demo:</span>
      </div>

      <p className="mt-2.5">
        After clicking on{" "}
        <span className="font-bold italic text-yellow-700">
          Continue To Payment
        </span>
        , you'll be redirected to the{" "}
        <span className="font-bold italic text-purple-700">
          Stripe payment form
        </span>
        .
      </p>
      <p className="mt-1">
        In the form, fill in the credit card number with{" "}
        <code className="rounded-md border border-gray-300 bg-gray-100 px-1 py-0.5">
          4242 4242 4242 4242
        </code>
        to complete the payment process without getting charged or having to
        give away your credit card information. For other fields such as{" "}
        <span className="italic">card CVC, expiry date</span>, you can fill in
        with any values.
      </p>
      <p className="mt-4">* Thanks for trying out the demo application.</p>
    </div>
  );
}

function IconInfo(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={props.className}
      fill="currentColor"
    >
      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
