import { MissingProductImage } from "~/pages/common/ErrorContents";
import { IconShirt } from "~/pages/common/Icons";

export type OrderSummary = {
  itemsSubtotal: number;
  shippingFee: number;
  subtotal: number;
  orderTotal: number;
};

export function OrderSummary(props: {
  orderSummary: OrderSummary;
  orderItems: {
    productName: string;
    quantity: number;
    productId: string;
    pricing: number;
    imgUrl: string | null;
  }[];
}) {
  return (
    <div className="min-w-[250px]">
      <div className="w-full rounded-md border border-gray-300 px-4 py-4">
        <p className="text-lg font-medium">
          Order Summary | {props.orderItems.length} Item(s)
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <p>Item(s) subtotal</p>
            <p>RM {props.orderSummary.subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>RM {props.orderSummary.shippingFee}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 font-semibold uppercase">
          <div className="flex justify-between">
            <p>SUBTOTAL</p>
            <p>RM {props.orderSummary.subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>ORDER TOTAL</p>
            <p>RM {props.orderSummary.orderTotal}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full border border-gray-300 px-4 py-4">
        <p className="text-lg font-medium">Order Item(s)</p>
        <ul className="mt-3 space-y-4">
          {props.orderItems.map((i) => (
            <li key={i.productId} className="flex">
              <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100">
                {i.imgUrl ? (
                  <img src={i.imgUrl} className="h-full w-full object-cover" />
                ) : (
                  <MissingProductImage />
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div className="pl-4 pt-1 text-sm">
                  <p className="font-medium">
                    {i.productName}{" "}
                    <span className="text-xs text-gray-400">
                      ({i.productId})
                    </span>
                  </p>
                  <p className="mt-0.5">x {i.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
