import { clsx as cx } from "clsx";

export function FormState2() {
  return (
    <div>
      <DeliveryInfo />
      <OrderSummaryPayment />
    </div>
  );
}

function DeliveryInfo() {
  return (
    <div className="rounded-md border border-gray-300">
      <div className="border-b border-gray-300 px-5 py-3 font-semibold">
        <p>1. Delivery Information</p>
      </div>
      <div className="px-5 py-4">
        <p className="font-semibold uppercase">SHIP TO ADDRESS</p>

        <div className="mt-4 space-y-0.5 text-sm">
          <p>James Madison</p>
          <p>04-05 Palm Villa</p>
          <p>Palm Street</p>
          <p>01000 George Town, Penang</p>
          <p>60186724552</p>
        </div>
      </div>
    </div>
  );
}

function OrderSummaryPayment() {
  return (
    <div className="mt-10 rounded-md border border-gray-300">
      <div className="border-b border-gray-300 px-5 py-3 font-semibold">
        <p>2. Order Summary</p>
      </div>
      <div className="px-5 py-4 text-sm">
        <div className="flex justify-between">
          <p>Item(s) subtotal</p>
          <p>RM 20.50</p>
        </div>
        <div className="mt-2 flex justify-between">
          <p>Shipping</p>
          <p>RM 20.00</p>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-2 flex justify-between">
          <p className="font-semibold">SUBTOTAL</p>
          <p>RM 20.50</p>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-2 flex justify-between">
          <p className="font-semibold">ORDER TOTAL</p>
          <p>RM 40.50</p>
        </div>

        <div className="mt-8">
          <button className="w-full bg-teal-500 py-2.5 font-semibold text-white md:w-[240px]">
            CONTINUE TO PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
}

export function FormState1(props: { onContinue: () => void }) {
  return (
    <div>
      <DeliveryForm onContinue={props.onContinue} />

      <div className="mt-6 rounded-md border border-gray-300 bg-gray-100 px-4 py-4 text-gray-500">
        <p className="font-semibold">2. Order Summary</p>
      </div>
    </div>
  );
}

function DeliveryForm(props: { onContinue: () => void }) {
  return (
    <div className="rounded-md border border-gray-300 px-5 py-5 text-sm">
      <p className="text-xl font-semibold">1. Delivery Information</p>
      <div className="mt-6 flex justify-end md:mt-0">
        <button className="w-full rounded-md bg-teal-500 py-2.5 font-semibold text-white md:w-[240px]">
          Pre-fill with sample values
        </button>
      </div>
      <DeliveryFormInput label="Full Name" marginTop="mt-6" />
      <div className="mt-4 space-y-4">
        <DeliveryFormInput label="Address 1" />
        <DeliveryFormInput label="Address 2" />
        <DeliveryFormInput label="City" />
        <DeliveryFormInput label="State" />
        <DeliveryFormInput label="Postal Code" />
        <DeliveryFormInput label="Mobile Phone" />
      </div>
      <div className="mt-8">
        <button
          onClick={props.onContinue}
          className="w-full rounded-md bg-teal-500 py-2.5 text-base font-semibold text-white md:w-[240px]"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

function DeliveryFormInput(props: { label: string; marginTop?: string }) {
  return (
    <div className={cx(props.marginTop)}>
      <label className="block font-medium">{props.label}</label>
      <input
        type="text"
        name=""
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        id=""
      />
    </div>
  );
}

export type OrderSummaryType = {
  itemsSubtotal: number;
  shippingFee: number;
  subtotal: number;
  orderTotal: number;
};

export function OrderSummary() {
  return (
    <div className="rounded-md border border-gray-300 px-5 py-4">
      <h2 className="text-lg font-medium">Order Summary | 10 ITEM(S)</h2>

      <div className="mt-4 text-sm">
        <div className="flex justify-between">
          <p>Item(s) subtotal</p>
          <p>RM 20.50</p>
        </div>
        <div className="mt-2 flex justify-between">
          <p>Shipping</p>
          <p>RM 20.00</p>
        </div>

        <div className="mt-5 flex justify-between text-base font-semibold">
          <p>SUBTOTAL</p>
          <p>RM 40.50</p>
        </div>
        <div className="mt-2 flex justify-between text-base font-semibold">
          <p>ORDER TOTAL</p>
          <p>RM 40.50</p>
        </div>
      </div>
    </div>
  );
}

export function OrderItem() {
  return (
    <div className="flex">
      <div className="h-20 w-20 rounded-md">
        <img
          className="h-full w-full rounded-md object-cover"
          src="/cowboy-fashion.jpg"
        />
      </div>
      <div className="pl-4 text-sm">
        <p className="font-medium">
          Simply Shirt <span className="text-xs text-gray-500">(S_6)</span>
        </p>
        <p>x1</p>
      </div>
    </div>
  );
}
